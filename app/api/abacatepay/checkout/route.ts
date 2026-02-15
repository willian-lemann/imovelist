import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { abacatePayClient } from "@/lib/abacatepay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (plan !== "professional") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const billing = await abacatePayClient.createBilling({
      frequency: "ONE_TIME",
      methods: ["PIX", "CARD"],
      products: [
        {
          externalId: "professional-plan",
          name: "Plano Profissional - ImovelList",
          description:
            "Acesso a todos os recursos premium: IA, Instagram, landing pages e imóveis ilimitados.",
          quantity: 1,
          price: 34900, // R$ 349,00 em centavos
        },
      ],
      returnUrl: `${appUrl}/subscription`,
      completionUrl: `${appUrl}/subscription?success=true`,
      customer: {
        name: session.user.name || session.user.email,
        cellphone: "",
        email: session.user.email,
        taxId: "",
      },
    });

    return NextResponse.json({ url: billing.url, billingId: billing.id });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
