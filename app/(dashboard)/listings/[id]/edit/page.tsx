"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingForm } from "@/components/listings/listing-form";
import { useListing } from "@/lib/queries/use-listings";
import BlurFade from "@/components/magicui/blur-fade";
import { ListingFormValues } from "@/lib/validations";

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: listing, isLoading } = useListing(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-muted-foreground mb-4">Listing not found</p>
        <Link href="/listings">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BlurFade delay={0}>
        <div className="flex items-center gap-3">
          <Link href={`/listings/${id}`}>
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Listing</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {listing.name || "Untitled"}
            </p>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.1} inView>
        <ListingForm
          mode="edit"
          initialData={{ ...(listing as ListingFormValues), id }}
        />
      </BlurFade>
    </div>
  );
}
