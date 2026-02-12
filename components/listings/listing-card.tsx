"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, Bed, MapPin, Maximize, Car } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BlurFade from "@/components/magicui/blur-fade";
import type { Listing } from "@/lib/queries/use-listings";

interface ListingCardProps {
  listing: Listing;
  index?: number;
  href?: string;
}

export function ListingCard({ listing, index = 0, href }: ListingCardProps) {
  const cardHref = href || `/listings/${listing.id}`;

  return (
    <BlurFade delay={0.05 * index} inView>
      <Link href={cardHref} className="block group">
        <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 h-full">
          <CardHeader className="p-0">
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
              {listing.image ? (
                <Image
                  src={listing.image}
                  alt={listing.name || "Property"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Maximize className="w-8 h-8" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <Badge
                  variant={listing.forSale ? "default" : "secondary"}
                  className="text-xs shadow-sm"
                >
                  {listing.forSale ? "Venda" : "Aluguel"}
                </Badge>
                {listing.type && (
                  <Badge
                    variant="secondary"
                    className="text-xs shadow-sm capitalize"
                  >
                    {listing.type}
                  </Badge>
                )}
              </div>
              {!listing.published && (
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className="text-xs bg-background/80 backdrop-blur-sm"
                  >
                    Rascunho
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {listing.name || "Imóvel sem título"}
            </h3>
            {listing.address && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 line-clamp-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {listing.address}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground pt-1">
              {listing.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" /> {listing.bedrooms}
                </span>
              )}
              {listing.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" /> {listing.bathrooms}
                </span>
              )}
              {listing.area != null && (
                <span className="flex items-center gap-1">
                  <Maximize className="w-3.5 h-3.5" /> {listing.area}m²
                </span>
              )}
              {listing.parking != null && listing.parking > 0 && (
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5" /> {listing.parking}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="px-4 py-3 border-t">
            <p className="text-lg font-bold text-primary">
              {listing.price
                ? `R$ ${listing.price.toLocaleString("pt-BR")}`
                : "Consultar valor"}
            </p>
            {listing.agency && (
              <span className="ml-auto text-xs text-muted-foreground">
                {listing.agency}
              </span>
            )}
          </CardFooter>
        </Card>
      </Link>
    </BlurFade>
  );
}
