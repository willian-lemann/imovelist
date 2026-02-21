"use client";

import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  subscriptionTier: string;
  instagramUserId: string | null;
}

interface StripeSubscription {
  plan: string;
  status: string;
  periodEnd?: string;
}

export function useUser() {
  const { data: session, isPending: isSessionPending } = useSession();

  console.log("Session data:", session);
  const { data: subscriptions } = useQuery<StripeSubscription[]>({
    queryKey: ["stripe-subscriptions"],
    queryFn: async () => {
      const { data } = await authClient.subscription.list();
      return (data as StripeSubscription[]) || [];
    },
    enabled: !!session?.user,
  });

  const activeSubscription = subscriptions?.find(
    (s) => s.status === "active" || s.status === "trialing",
  );

  const subscriptionPlan =
    activeSubscription?.plan || user?.subscriptionTier || "free";

  const isLoading = isSessionPending || isUserLoading;

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!session?.user,
    isPremium: subscriptionPlan === "professional",
    subscriptionPlan,
    activeSubscription,
  };
}
