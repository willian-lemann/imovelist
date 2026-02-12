"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useListings } from "@/lib/queries/use-listings";
import { ListingGrid } from "@/components/listings/listing-grid";
import BlurFade from "@/components/magicui/blur-fade";

const propertyTypes = [
  { label: "Todos", value: "" },
  { label: "Apartamento", value: "apartment" },
  { label: "Casa", value: "house" },
  { label: "Condomínio", value: "condo" },
  { label: "Comercial", value: "commercial" },
  { label: "Terreno", value: "land" },
  { label: "Mansão", value: "villa" },
];

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [forSale, setForSale] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListings({
    published: true,
    search: search || undefined,
    type: type || undefined,
    forSale: forSale !== "" ? forSale === "true" : undefined,
    page,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-semibold">EstateHub</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Começar</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Search header */}
        <BlurFade delay={0}>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Procurar Imóveis
            </h1>
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por nome, localização..."
                className="pl-9 h-10"
              />
            </div>
          </div>
        </BlurFade>

        {/* Filters */}
        <BlurFade delay={0.05} inView>
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            {propertyTypes.map((t) => (
              <Badge
                key={t.value}
                variant={type === t.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setType(t.value);
                  setPage(1);
                }}
              >
                {t.label}
              </Badge>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            <Badge
              variant={forSale === "" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setForSale("")}
            >
              Todos
            </Badge>
            <Badge
              variant={forSale === "true" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setForSale("true")}
            >
              Venda
            </Badge>
            <Badge
              variant={forSale === "false" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setForSale("false")}
            >
              Aluguel
            </Badge>
          </div>
        </BlurFade>

        {/* Results */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {data?.total ?? 0} imóveis encontrados
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              emptyMessage="Nenhum imóvel corresponde à sua busca"
              hrefPrefix="/property"
            />
          )}

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
