"use client";

import { useSession } from "@/lib/auth-client";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  subscriptionTier: string;
  instagramUserId: string | null;
}

export function useUser() {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user as User | undefined,
    isLoading: isPending,
    error,
    isAuthenticated: !!session?.user,
    isPremium:
      (session?.user as User | undefined)?.subscriptionTier === "professional",
  };
}
