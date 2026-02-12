"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { ListingForm } from "@/components/listings/listing-form";

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <BlurFade delay={0}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create New Listing
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in the details for your property listing.
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.1} inView>
        <ListingForm mode="create" />
      </BlurFade>
    </div>
  );
}
