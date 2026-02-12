"use client";

import type { Listing } from "@/lib/queries/use-listings";
import { ListingCard } from "./listing-card";

interface ListingGridProps {
  listings: Listing[];
  emptyMessage?: string;
  hrefPrefix?: string;
}

export function ListingGrid({
  listings,
  emptyMessage = "Nenhum imóvel encontrado",
  hrefPrefix,
}: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          index={index}
          href={hrefPrefix ? `${hrefPrefix}/${listing.id}` : undefined}
        />
      ))}
    </div>
  );
}
