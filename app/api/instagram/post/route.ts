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

  if (!user?.instagramToken) {
    return NextResponse.json(
      { error: "Instagram not connected" },
      { status: 400 },
    );
  }

  const { caption, imageUrl } = await req.json();

  if (!caption || !imageUrl) {
    return NextResponse.json(
      { error: "Caption and image URL required" },
      { status: 400 },
    );
  }

  try {
    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.instagram.com/v18.0/${user.instagramUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: user.instagramToken,
        }),
      },
    );

    const container = await containerRes.json();

    if (!container.id) {
      return NextResponse.json(
        { error: "Failed to create media container" },
        { status: 500 },
      );
    }

    // Step 2: Publish the container
    const publishRes = await fetch(
      `https://graph.instagram.com/v18.0/${user.instagramUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: container.id,
          access_token: user.instagramToken,
        }),
      },
    );

    const published = await publishRes.json();

    return NextResponse.json({
      success: true,
      mediaId: published.id,
    });
  } catch (error) {
    console.error("Instagram post error:", error);
    return NextResponse.json(
      { error: "Failed to post to Instagram" },
      { status: 500 },
    );
  }
}
