"use client";

import { useUser } from "@/lib/queries/use-user";
import { UpgradePrompt } from "@/components/subscription/upgrade-button";
import { ImageEditor } from "@/components/gallery/image-editor";
import BlurFade from "@/components/magicui/blur-fade";

export default function GalleryPage() {
  const { isPremium } = useUser();

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <BlurFade delay={0}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AI Gallery</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Enhance property photos with AI-powered editing
            </p>
          </div>
        </BlurFade>
        <UpgradePrompt
          feature="AI Image Editing"
          description="Use AI to enhance your property photos, stage empty rooms, improve lighting, and more. Available on the Professional plan."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BlurFade delay={0}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Gallery</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Enhance your property photos with AI-powered editing tools
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.1} inView>
        <ImageEditor />
      </BlurFade>
    </div>
  );
}
