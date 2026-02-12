"use client";

import { useState } from "react";
import { Loader2, Sparkles, Code, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useUser } from "@/lib/queries/use-user";
import { useListings } from "@/lib/queries/use-listings";
import { UpgradePrompt } from "@/components/subscription/upgrade-button";
import BlurFade from "@/components/magicui/blur-fade";

export default function LandingPagesPage() {
  const { user, isPremium } = useUser();
  const { data: listingsData } = useListings({ agentId: user?.id });
  const [generating, setGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <BlurFade delay={0}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              AI Landing Pages
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Generate beautiful landing pages for your listings
            </p>
          </div>
        </BlurFade>
        <UpgradePrompt
          feature="AI Landing Page Generator"
          description="Automatically generate stunning landing pages for your property listings with AI. Available on the Professional plan."
        />
      </div>
    );
  }

  async function handleGenerate(listingId: string) {
    setGenerating(true);
    setSelectedListing(listingId);
    try {
      const res = await fetch("/api/ai/generate-landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      setGeneratedHtml(data.html);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <BlurFade delay={0}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            AI Landing Pages
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Select a listing to generate a custom landing page
          </p>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Listing selector */}
        <BlurFade delay={0.05} inView>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Listing</CardTitle>
              <CardDescription>
                Pick a listing to generate a page for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {listingsData?.listings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => handleGenerate(listing.id)}
                  disabled={generating}
                  className={`w-full text-left p-3 rounded-lg text-sm border transition-colors ${
                    selectedListing === listing.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-muted"
                  }`}
                >
                  <p className="font-medium truncate">
                    {listing.name || "Untitled"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {listing.address || "No address"}
                  </p>
                </button>
              )) || (
                <p className="text-sm text-muted-foreground">No listings yet</p>
              )}
            </CardContent>
          </Card>
        </BlurFade>

        {/* Preview */}
        <BlurFade delay={0.1} inView>
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">
                {generating
                  ? "Generating..."
                  : generatedHtml
                    ? "Preview"
                    : "Landing Page Preview"}
              </CardTitle>
              {generatedHtml && (
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === "preview" ? "default" : "ghost"}
                    size="icon-xs"
                    onClick={() => setViewMode("preview")}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === "code" ? "default" : "ghost"}
                    size="icon-xs"
                    onClick={() => setViewMode("code")}
                  >
                    <Code className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {generating ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : generatedHtml ? (
                viewMode === "preview" ? (
                  <iframe
                    srcDoc={generatedHtml}
                    className="w-full h-[600px] rounded-lg border"
                    title="Landing Page Preview"
                  />
                ) : (
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-[600px]">
                    <code>{generatedHtml}</code>
                  </pre>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Select a listing to generate a landing page
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </BlurFade>
      </div>
    </div>
  );
}
