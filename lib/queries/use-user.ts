"use client";

import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  subscriptionTier: string;
  instagramUserId: string | null;
}

export function useUser() {
  const { data: session, isPending: isSessionPending } = useSession();

  const {
    data: user,
    isLoading: isUserLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
    enabled: !!session?.user,
  });

  const isLoading = isSessionPending || isUserLoading;

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!session?.user,
    isPremium: user?.subscriptionTier === "professional",
  };
}
