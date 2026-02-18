import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      onEvent: async (event) => {
        console.log("[Stripe Webhook] event received:", event.type);
      },
      subscription: {
        enabled: true,
        plans: [
          {
            name: "starter",
            priceId: process.env.STRIPE_STARTER_PRICE_ID!,
            limits: {
              listings: 5,
            },
          },
          {
            name: "professional",
            priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
            limits: {
              listings: Infinity,
            },
          },
        ],
        onSubscriptionComplete: async ({ subscription, plan }) => {
          console.log(
            `[Stripe] Subscription complete: plan=${plan.name} status=${subscription.status}`,
          );
        },
        onSubscriptionCreated: async ({ subscription, plan }) => {
          console.log(
            `[Stripe] Subscription created: plan=${plan.name} id=${subscription.id}`,
          );
        },
        onSubscriptionUpdate: async ({ subscription }) => {
          console.log(
            `[Stripe] Subscription updated: status=${subscription.status}`,
          );
        },
        onSubscriptionDeleted: async ({ subscription }) => {
          console.log(`[Stripe] Subscription deleted: id=${subscription.id}`);
        },
        onSubscriptionCancel: async ({ subscription }) => {
          console.log(`[Stripe] Subscription cancelled: id=${subscription.id}`);
        },
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;

export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return session;
}
