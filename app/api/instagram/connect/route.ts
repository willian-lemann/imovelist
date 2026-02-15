import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      Subscriptions: {
        where: { status: "active" },
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
  });

  const subscriptionTier = user?.Subscriptions[0]?.plan || "free";

  if (subscriptionTier !== "professional") {
    return NextResponse.json(
      { error: "Professional plan required" },
      { status: 403 },
    );
  }

  // Instagram OAuth redirect
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!;
  const appId = process.env.INSTAGRAM_APP_ID!;

  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;

  return NextResponse.json({ authUrl });
}
