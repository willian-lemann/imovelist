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
      { error: "Professional plan required for AI features" },
      { status: 403 },
    );
  }

  const { listingId } = await req.json();

  const listing = await prisma.listings.findUnique({
    where: { id: listingId },
    include: { User: { select: { name: true, email: true } } },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Generate landing page HTML using listing data
  // In production, integrate with OpenAI API
  const landingPageHtml = generateLandingPage(listing);

  return NextResponse.json({
    html: landingPageHtml,
    listing,
  });
}

function generateLandingPage(listing: Record<string, unknown>) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${listing.name || "Property Listing"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; color: #1a1a1a; }
    .hero { position: relative; height: 70vh; background: url('${listing.image}') center/cover; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7)); display: flex; align-items: flex-end; padding: 3rem; }
    .hero h1 { color: white; font-size: 3rem; font-weight: 700; }
    .hero p { color: rgba(255,255,255,0.9); font-size: 1.25rem; margin-top: 0.5rem; }
    .details { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; }
    .price { font-size: 2.5rem; font-weight: 700; color: #7c3aed; }
    .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
    .feature { text-align: center; padding: 1.5rem; background: #f9fafb; border-radius: 12px; }
    .feature-value { font-size: 1.5rem; font-weight: 700; }
    .feature-label { color: #6b7280; margin-top: 0.25rem; }
    .contact { background: #f9fafb; padding: 2rem; border-radius: 16px; height: fit-content; }
    .contact h3 { margin-bottom: 1rem; }
    .btn { display: block; width: 100%; padding: 1rem; background: #7c3aed; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; text-align: center; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-overlay">
      <div>
        <h1>${listing.name || "Beautiful Property"}</h1>
        <p>${listing.address || ""}</p>
      </div>
    </div>
  </div>
  <div class="details">
    <div>
      <p class="price">$${(listing.price as number)?.toLocaleString() || "Contact for price"}</p>
      <div class="features">
        <div class="feature"><div class="feature-value">${listing.bedrooms || "-"}</div><div class="feature-label">Bedrooms</div></div>
        <div class="feature"><div class="feature-value">${listing.bathrooms || "-"}</div><div class="feature-label">Bathrooms</div></div>
        <div class="feature"><div class="feature-value">${listing.area || "-"} m²</div><div class="feature-label">Area</div></div>
      </div>
      <div style="margin-top:2rem">${listing.content || ""}</div>
    </div>
    <div class="contact">
      <h3>Interested in this property?</h3>
      <p>Contact the agent for more information or to schedule a viewing.</p>
      <button class="btn">Contact Agent</button>
    </div>
  </div>
</body>
</html>`;
}
