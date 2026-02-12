"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListings } from "@/lib/queries/use-listings";
import { useUser } from "@/lib/queries/use-user";
import { ListingGrid } from "@/components/listings/listing-grid";
import { ListingFilters } from "@/components/listings/listing-filters";
import BlurFade from "@/components/magicui/blur-fade";

const defaultFilters = {
  search: "",
  type: "",
  forSale: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
};

export default function ListingsPage() {
  const { user } = useUser();
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListings({
    agentId: user?.id,
    search: filters.search || undefined,
    type: filters.type || undefined,
    forSale: filters.forSale !== "" ? filters.forSale === "true" : undefined,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
    bathrooms: filters.bathrooms ? parseInt(filters.bathrooms) : undefined,
    page,
    limit: 12,
  });

  return (
    <div className="space-y-6">
      <BlurFade delay={0}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Meus Imóveis</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {data?.total ?? 0} imóveis no total
            </p>
          </div>
          <Link href="/listings/new">
            <Button className="gap-1.5">
              <Plus className="w-4 h-4" /> Novo Imóvel
            </Button>
          </Link>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Filters sidebar */}
        <BlurFade delay={0.05} inView>
          <div className="lg:sticky lg:top-24">
            <ListingFilters
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPage(1);
              }}
              onClear={() => {
                setFilters(defaultFilters);
                setPage(1);
              }}
            />
          </div>
        </BlurFade>

        {/* Listings grid */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl overflow-hidden ring-1 ring-foreground/10"
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ListingGrid
              listings={data?.listings || []}
              emptyMessage="Nenhum imóvel corresponde aos seus filtros"
            />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
