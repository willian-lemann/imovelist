import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  console.log("caiuuuu");
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");
  const type = searchParams.get("type");
  const forSale = searchParams.get("forSale");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bedrooms = searchParams.get("bedrooms");
  const bathrooms = searchParams.get("bathrooms");
  const search = searchParams.get("search");
  const agentId = searchParams.get("agentId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: Record<string, unknown> = {};

  if (published !== null) where.published = published === "true";
  if (type) where.type = type;
  if (forSale !== null) where.for_sale = forSale === "true";
  if (agentId) where.agent_id = parseInt(agentId);
  if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
  if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms) };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice)
      (where.price as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice)
      (where.price as Record<string, number>).lte = parseFloat(maxPrice);
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [listings, total] = await Promise.all([
    prisma.listings.findMany({
      where,
      include: {
        users: { select: { id: true, full_name: true, profile_photo: true } },
      },
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listings.count({ where }),
  ]);

  console.log("caiu aqui ");

  return NextResponse.json({
    listings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const listing = await prisma.listings.create({
    data: {
      ...data,
      agentId: session.user.id,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
