import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
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

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const subscriptionTier = user.Subscriptions[0]?.plan || "free";

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    subscriptionTier,
    instagramUserId: user.instagramUserId,
  });
}
