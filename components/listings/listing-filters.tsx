"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ListingFiltersProps {
  filters: {
    search: string;
    type: string;
    forSale: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    bathrooms: string;
  };
  onChange: (filters: ListingFiltersProps["filters"]) => void;
  onClear: () => void;
}

const propertyTypes = [
  { label: "Todos", value: "" },
  { label: "Apartamento", value: "apartment" },
  { label: "Casa", value: "house" },
  { label: "Condomínio", value: "condo" },
  { label: "Sobrado", value: "townhouse" },
  { label: "Comercial", value: "commercial" },
  { label: "Terreno", value: "land" },
  { label: "Mansão", value: "villa" },
];

export function ListingFilters({
  filters,
  onChange,
  onClear,
}: ListingFiltersProps) {
  const update = (key: string, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Buscar por nome, endereço..."
          className="pl-9"
        />
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Tipo de Imóvel
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {propertyTypes.map((t) => (
            <Badge
              key={t.value}
              variant={filters.type === t.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => update("type", t.value)}
            >
              {t.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sale/Rent */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Finalidade
        </Label>
        <div className="flex gap-1.5">
          <Badge
            variant={filters.forSale === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => update("forSale", "")}
          >
            Todos
          </Badge>
          <Badge
            variant={filters.forSale === "true" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => update("forSale", "true")}
          >
            Venda
          </Badge>
          <Badge
            variant={filters.forSale === "false" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => update("forSale", "false")}
          >
            Aluguel
          </Badge>
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Preço Mínimo</Label>
          <Input
            type="number"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder="R$ 0"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Preço Máximo</Label>
          <Input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder="R$ ∞"
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Mín Quartos</Label>
          <Input
            type="number"
            value={filters.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            placeholder="Qualquer"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mín Banheiros</Label>
          <Input
            type="number"
            value={filters.bathrooms}
            onChange={(e) => update("bathrooms", e.target.value)}
            placeholder="Qualquer"
          />
        </div>
      </div>

      {/* Clear */}
      {activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClear} className="w-full">
          <X className="w-3.5 h-3.5 mr-1.5" />
          Limpar filtros ({activeCount})
        </Button>
      )}
    </div>
  );
}
