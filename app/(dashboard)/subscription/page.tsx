"use client";

import { useUser } from "@/lib/queries/use-user";
import { PricingCards } from "@/components/subscription/pricing-cards";
import BlurFade from "@/components/magicui/blur-fade";

export default function SubscriptionPage() {
  const { user, isPremium } = useUser();

  async function handleUpgrade() {
    // In production, use Better-Auth Stripe plugin to create checkout session
    try {
      // authClient.stripe.createCheckoutSession({ plan: "professional" })
      alert(
        "Stripe checkout integration - configure STRIPE_SECRET_KEY to enable",
      );
    } catch (err) {
      console.error("Upgrade failed:", err);
    }
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-bold tracking-tight">
            {isPremium ? "Your Subscription" : "Choose Your Plan"}
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            {isPremium
              ? "You're on the Professional plan. Enjoy all premium features!"
              : "Unlock AI-powered tools and integrations for your real estate business."}
          </p>
        </div>
      </BlurFade>

      <PricingCards
        currentPlan={user?.subscriptionTier || "free"}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
