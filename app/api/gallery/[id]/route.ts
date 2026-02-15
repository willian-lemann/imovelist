import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const gallery = await prisma.galleries.findUnique({
    where: { id: +id },
    include: { Listings: true },
  });

  if (!gallery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(gallery);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const gallery = await prisma.galleries.findUnique({ where: { id: +id } });

  if (!gallery || gallery.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.galleries.delete({ where: { id: +id } });

  return NextResponse.json({ success: true });
}
