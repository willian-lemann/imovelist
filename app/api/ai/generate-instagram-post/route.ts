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
  });

  if (user?.subscriptionTier !== "professional") {
    return NextResponse.json(
      { error: "Professional plan required" },
      { status: 403 },
    );
  }

  const { listingId } = await req.json();

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Generate Instagram post content
  // In production, use OpenAI API for caption generation
  const caption = generateCaption(listing);
  const hashtags = generateHashtags(listing);

  return NextResponse.json({
    caption,
    hashtags,
    suggestedImage: listing.image,
    listing,
  });
}

function generateCaption(listing: Record<string, unknown>): string {
  const parts = [];
  if (listing.name) parts.push(`✨ ${listing.name}`);
  if (listing.address) parts.push(`📍 ${listing.address}`);
  if (listing.price)
    parts.push(`💰 $${(listing.price as number).toLocaleString()}`);

  const features = [];
  if (listing.bedrooms) features.push(`${listing.bedrooms} bed`);
  if (listing.bathrooms) features.push(`${listing.bathrooms} bath`);
  if (listing.area) features.push(`${listing.area}m²`);
  if (features.length) parts.push(`🏠 ${features.join(" | ")}`);

  parts.push("");
  parts.push("📞 Contact us for viewings and more information!");

  return parts.join("\n");
}

function generateHashtags(listing: Record<string, unknown>): string[] {
  const tags = [
    "#realestate",
    "#property",
    "#forsale",
    "#home",
    "#dreamhome",
    "#realtor",
    "#househunting",
    "#investment",
  ];

  if (listing.type) tags.push(`#${listing.type}`);
  if (listing.forSale === false) tags.push("#forrent");

  return tags;
}
