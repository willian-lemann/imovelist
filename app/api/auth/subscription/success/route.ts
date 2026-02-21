import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const callbackURL = searchParams.get("callbackURL") || "/subscription";
  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return NextResponse.redirect(new URL(callbackURL, req.url));
  }

  try {
    const existing = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (existing && existing.status !== "active") {
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: "active",
          updatedAt: new Date(),
        },
      });
    }
  } catch (err) {
    console.error("[subscription/success] DB update failed:", err);
  }

  return redirect(callbackURL);
}
