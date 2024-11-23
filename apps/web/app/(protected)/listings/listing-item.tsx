import Link from "next/link";

import { BathIcon, BedIcon, RulerIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card"; 
import { createSlug } from "@/lib/utils";

import { PhotosCarousel } from "./photos-carousel";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EditButton } from "./edit-button";

type ListingItemProps = {
  isLogged: boolean;
  listing: {
    id: string;
    image: string;
    name: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    price: number;
    photos: { href: string }[];
    forSale: boolean;
    type: string;
    ref: string;
    placeholderImage: string;
    agent_id: number;
    isOnwer: boolean;
  };
};

export async function ListingItem({ listing }: ListingItemProps) {
  function getListingURL(listingItem: any) {
    return `/listings/${listingItem.id}-${createSlug(listingItem.address)}`;
  }

  return (
    <Link href={getListingURL(listing)} key={listing.id}>
      <Card className="w-full max-w-md animate-fadeIn relative shadow-none overflow-hidden rounded-lg border-none transition-all">
        <div>
          {listing.isOnwer ? (
            <Badge className="absolute rounded-full hover:bg-white top-3 left-2 z-50 bg-white">
              <Label className="text-sm text-primary font-bold">
                Meu anúncio
              </Label>
            </Badge>
          ) : null}

          <PhotosCarousel
            photos={listing.photos}
            placeholderImage={listing.placeholderImage}
          />
        </div>

        <div className="py-4 bg-background">
          <div className="flex items-center justify-between mb-2">
            <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
              {listing.type}
            </div>
            <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
              {listing.forSale ? "Venda" : "Aluguel"}
            </div>
          </div>
          <h3 className="text-base font-semibold mb-2 text-muted-foreground">
            {listing.name || listing.address}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <BedIcon className="w-4 h-4 mr-1" />
            {listing.bedrooms} Quarto(s)
            <Separator orientation="vertical" className="mx-2" />
            <BathIcon className="w-4 h-4 mr-1" />
            {listing.bathrooms} Banheiro(s)
            <Separator orientation="vertical" className="mx-2" />
            {listing.area ? (
              <>
                <RulerIcon className="w-4 h-4 mr-1" />
                {listing.area}
              </>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">R$ {listing.price}</div>

            {listing.isOnwer ? <EditButton id={listing.id} /> : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
