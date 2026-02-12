"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PostPreviewProps {
  image?: string;
  caption?: string;
  hashtags?: string[];
}

export function PostPreview({ image, caption, hashtags }: PostPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Post Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-sm mx-auto">
          {/* Instagram-style card */}
          <div className="border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 p-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" />
              <span className="text-sm font-semibold">your_agency</span>
            </div>

            {/* Image */}
            <div className="aspect-square bg-muted relative">
              {image ? (
                <Image src={image} alt="Post" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                  No image selected
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="p-3 space-y-2">
              {caption && (
                <p className="text-sm whitespace-pre-line">{caption}</p>
              )}
              {hashtags && hashtags.length > 0 && (
                <p className="text-sm text-primary">{hashtags.join(" ")}</p>
              )}
              {!caption && !hashtags && (
                <p className="text-sm text-muted-foreground italic">
                  Caption will appear here...
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
