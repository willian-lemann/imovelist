import { NextRequest, NextResponse } from "next/server";
import { stripeClient } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  try {
    const event = stripeClient.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        // Handle successful checkout - Better-Auth Stripe plugin handles this
        console.log("Checkout completed:", event.data.object.id);
        break;
      }
      case "customer.subscription.updated": {
        console.log("Subscription updated:", event.data.object.id);
        break;
      }
      case "customer.subscription.deleted": {
        console.log("Subscription deleted:", event.data.object.id);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
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
