"use client";

import { useState } from "react";
import { Instagram, Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUser } from "@/lib/queries/use-user";
import { useListings } from "@/lib/queries/use-listings";
import { UpgradePrompt } from "@/components/subscription/upgrade-button";
import { InstagramConnectButton } from "@/components/instagram/instagram-connect-button";
import { PostPreview } from "@/components/instagram/post-preview";
import BlurFade from "@/components/magicui/blur-fade";

export default function InstagramPage() {
  const { user, isPremium } = useUser();
  const { data: listingsData } = useListings({ agentId: user?.id });
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <BlurFade delay={0}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Instagram</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Connect and post to Instagram directly
            </p>
          </div>
        </BlurFade>
        <UpgradePrompt
          feature="Instagram Integration"
          description="Connect your Instagram account, auto-generate captions with AI, and post property listings directly. Available on the Professional plan."
        />
      </div>
    );
  }

  async function handleGenerate(listingId: string) {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-instagram-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      setCaption(data.caption);
      setHashtags(data.hashtags);
      setSelectedImage(data.suggestedImage || "");
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  async function handlePost() {
    if (!caption || !selectedImage) return;
    setPosting(true);
    try {
      const fullCaption = `${caption}\n\n${hashtags.join(" ")}`;
      await fetch("/api/instagram/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: fullCaption, imageUrl: selectedImage }),
      });
      alert("Posted successfully!");
    } catch (err) {
      console.error("Post failed:", err);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="space-y-6">
      <BlurFade delay={0}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Instagram</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Generate AI captions and post to Instagram
            </p>
          </div>
          <InstagramConnectButton />
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="space-y-4">
          <BlurFade delay={0.05} inView>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Generate from Listing
                </CardTitle>
                <CardDescription>
                  Select a listing to auto-generate a post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                {listingsData?.listings.map((listing) => (
                  <button
                    key={listing.id}
                    onClick={() => handleGenerate(listing.id)}
                    disabled={generating}
                    className="w-full text-left p-2 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <p className="font-medium truncate">
                      {listing.name || "Untitled"}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={0.1} inView>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compose Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Caption</Label>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={5}
                    placeholder="Write your caption..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Hashtags</Label>
                  <div className="flex flex-wrap gap-1">
                    {hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={handlePost}
                  disabled={posting || !caption}
                >
                  {posting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Post to Instagram
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Preview */}
        <BlurFade delay={0.15} inView>
          <PostPreview
            image={selectedImage}
            caption={caption}
            hashtags={hashtags}
          />
        </BlurFade>
      </div>
    </div>
  );
}
