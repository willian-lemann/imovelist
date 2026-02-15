import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { abacatePayClient } from "@/lib/abacatepay";
import * as Sentry from "@sentry/nextjs";

/**
 * Webhook da AbacatePay
 * Eventos: billing.paid, pix.paid, pix.expired, withdraw.paid
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body?.event;
    const data = body?.data;

    if (!event || !data) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    switch (event) {
      case "billing.paid": {
        const billingId = data.id as string;
        const customerEmail = data.customer?.metadata?.email as string;

        if (!customerEmail) {
          Sentry.logger.info("Webhook billing.paid sem email do cliente");
          console.error("Webhook billing.paid sem email do cliente");
          break;
        }

        // Busca o usuário pelo email
        const user = await prisma.user.findUnique({
          where: { email: customerEmail },
        });

        if (!user) {
          console.error(`Usuário não encontrado para email: ${customerEmail}`);
          break;
        }

        // Busca detalhes da cobrança para verificar o produto
        let billing;
        try {
          billing = await abacatePayClient.getBilling(billingId);
        } catch {
          console.error(`Erro ao buscar billing ${billingId}`);
          break;
        }

        const isProfessionalProduct = billing.products?.some(
          (p) => p.externalId === "professional-plan",
        );

        if (isProfessionalProduct) {
          // Atualiza a subscription do usuário
          await prisma.subscriptions.upsert({
            where: {
              abacatepay_billing_id: billingId,
            },
            update: {
              status: "active",
              updated_at: new Date(),
            },
            create: {
              user_id: user.id,
              abacatepay_customer_id: data.customer?.id || "",
              abacatepay_billing_id: billingId,
              plan: "professional",
              status: "active",
              created_at: new Date(),
              updated_at: new Date(),
            },
          });

          console.log(
            `Subscription ativada para usuário ${user.id} (billing: ${billingId})`,
          );
        }
        break;
      }

      case "pix.paid": {
        console.log("PIX pago:", data.id);
        break;
      }

      case "pix.expired": {
        console.log("PIX expirado:", data.id);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
