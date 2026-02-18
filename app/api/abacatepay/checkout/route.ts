import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { abacatePayClient } from "@/lib/abacatepay";
import prisma from "@/lib/prisma";
import { plans } from "@/components/subscription/plans";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (plan !== "professional" && plan !== "starter") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Buscar o usuário com o abacatepay_customer_id
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const selectedPlan = plans.find((p) => p.id === plan);

    if (!selectedPlan) {
      return NextResponse.json(
        { error: "Plano selecionado não encontrado" },
        { status: 400 },
      );
    }

    // Se o usuário já tem um customerId, usa ele; senão cria inline
    const billingData: Parameters<typeof abacatePayClient.createBilling>[0] = {
      frequency: "MULTIPLE_PAYMENTS",
      methods: ["PIX"],
      products: [
        {
          externalId: `${selectedPlan?.id}-plan`,
          name: `Plano ${selectedPlan?.name} - ImovelList`,
          description: selectedPlan?.description,
          quantity: 1,
          price: selectedPlan.price,
        },
      ],
      returnUrl: `${appUrl}/subscription`,
      completionUrl: `${appUrl}/subscription?success=true`,
    };

    if (user.abacatepay_customer_id) {
      billingData.customerId = user.abacatepay_customer_id;
    } else {
      // Fallback: cria customer inline com dados do usuário
      billingData.customer = {
        name: user.name || user.email,
        cellphone: user.cellphone || "",
        email: user.email,
        taxId: user.taxId || "",
      };
    }

    const billing = await abacatePayClient.createBilling(billingData);

    // Se não tinha customerId, salvar o que veio da billing
    if (!user.abacatepay_customer_id && billing.customer?.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { abacatepay_customer_id: billing.customer.id },
      });
    }

    return NextResponse.json({ url: billing.url, billingId: billing.id });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
