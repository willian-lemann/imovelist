"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Bath,
  Bed,
  Car,
  Edit,
  ExternalLink,
  MapPin,
  Maximize,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListing, useDeleteListing } from "@/lib/queries/use-listings";
import { useRouter } from "next/navigation";
import BlurFade from "@/components/magicui/blur-fade";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: listing, isLoading } = useListing(id);
  const deleteListing = useDeleteListing();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="aspect-[21/9] bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Listing not found</p>
        <Link href="/listings">
          <Button variant="outline">Back to Listings</Button>
        </Link>
      </div>
    );
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    await deleteListing.mutateAsync(id);
    router.push("/listings");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <BlurFade delay={0}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/listings">
              <Button variant="ghost" size="icon-sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {listing.name || "Untitled Listing"}
              </h2>
              {listing.address && (
                <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {listing.address}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/listings/${id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={handleDelete}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          </div>
        </div>
      </BlurFade>

      {/* Hero image */}
      <BlurFade delay={0.1} inView>
        {listing.image ? (
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-muted">
            <Image
              src={listing.image}
              alt={listing.name || ""}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant={listing.forSale ? "default" : "secondary"}>
                {listing.forSale ? "For Sale" : "For Rent"}
              </Badge>
              {!listing.published && (
                <Badge variant="outline" className="bg-background/80">
                  Draft
                </Badge>
              )}
              {listing.type && (
                <Badge variant="secondary" className="capitalize">
                  {listing.type}
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="aspect-[21/9] rounded-xl bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No image</p>
          </div>
        )}
      </BlurFade>

      {/* Details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <BlurFade delay={0.15} inView>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Bedrooms", value: listing.bedrooms, icon: Bed },
                  { label: "Bathrooms", value: listing.bathrooms, icon: Bath },
                  {
                    label: "Area",
                    value: listing.area ? `${listing.area}m²` : null,
                    icon: Maximize,
                  },
                  { label: "Parking", value: listing.parking, icon: Car },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-3 rounded-lg bg-muted/50"
                  >
                    <item.icon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-lg font-semibold">{item.value ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </BlurFade>

          {listing.content && (
            <BlurFade delay={0.2} inView>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {listing.content}
                  </p>
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Photo gallery */}
          {listing.photos && listing.photos.length > 0 && (
            <BlurFade delay={0.25} inView>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Photos ({listing.photos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {listing.photos.map((photo, i) => (
                      <div
                        key={i}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted"
                      >
                        <Image
                          src={photo}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <BlurFade delay={0.15} inView>
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-primary mb-2">
                  {listing.price
                    ? `$${listing.price.toLocaleString()}`
                    : "Contact for price"}
                </p>
                {listing.agency && (
                  <p className="text-sm text-muted-foreground">
                    {listing.agency}
                  </p>
                )}
                {listing.ref && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ref: {listing.ref}
                  </p>
                )}
                {listing.link && (
                  <a
                    href={listing.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> View Source
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
