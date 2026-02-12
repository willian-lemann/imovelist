import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (listingId) where.listingId = listingId;

  const galleries = await prisma.gallery.findMany({
    where,
    include: { listing: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(galleries);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check premium access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.subscriptionTier !== "professional") {
    return NextResponse.json(
      { error: "Professional plan required" },
      { status: 403 },
    );
  }

  const data = await req.json();

  const gallery = await prisma.gallery.create({
    data: {
      originalImage: data.originalImage,
      editedImage: data.editedImage,
      prompt: data.prompt,
      listingId: data.listingId,
      userId: session.user.id,
    },
  });

  return NextResponse.json(gallery, { status: 201 });
}
