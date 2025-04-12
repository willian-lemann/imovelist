"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchIcon, ListFilterIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Capitalize } from "@/lib/utils";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const types = [
  { label: "Apartamento", value: "apartamento" },
  { label: "Comercial", value: "comercial" },
  { label: "Residencial", value: "residencial" },
];

const filters = [
  { label: "Aluguel", value: "aluguel" },
  { label: "Venda", value: "venda" },
];

export function SearchContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const router = useRouter();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const hasFilters =
    searchParams.has("filter") ||
    searchParams.has("type") ||
    searchParams.has("q");

  function handleSearch() {
    if (search) {
      router.push(`?${createQueryString("q", search)}`);
    } else {
      router.push(`?${createQueryString("q", "")}`);
    }
  }

  function handleFilter(filter) {
    router.push(`?${createQueryString("filter", filter)}`);
  }

  function handleType(type) {
    if (type) {
      router.push(`?${createQueryString("type", type)}`);
    } else {
      router.push(`?${createQueryString("type", "")}`);
    }
  }

  function clearFilters() {
    router.push("?");
  }

  function clearQueryFilter() {
    router.push(`?${createQueryString("q", "")}`);
    setSearch("");
  }

  useEffect(() => {
    document.addEventListener("input", (e) => {
      if (!e.inputType) {
        clearQueryFilter();
      }
    });

    return () => {
      document.removeEventListener("input", (e) => {
        if (!e.inputType) {
          clearQueryFilter();
        }
      });
    };
  }, []);

  return (
    <>
      <div className="relative flex-1 max-w-lg flex">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Pesquise pelo nome, endereço ou código do imóvel"
          value={search}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />

        {/* mobile filters */}
        <div className="flex md:hidden gap-1 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-1">
                <ListFilterIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {Capitalize(searchParams.get("filter")) || "Filtrar por"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filters.map((filter) => (
                <DropdownMenuCheckboxItem
                  key={filter.value}
                  checked={searchParams.get("filter") === filter.value}
                  onClick={() => handleFilter(filter.value)}
                >
                  {filter.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-1">
                <ListFilterIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {Capitalize(searchParams.get("type")) || "Tipo de imóvel"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tipo de imóvel</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {types.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type.value}
                  checked={searchParams.get("type") === type.value}
                  onClick={() => handleType(type.value)}
                >
                  {type.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Button
        onClick={handleSearch}
        type="button"
        className="px-6 py-3 rounded-r-lg"
      >
        <SearchIcon className="mr-2 w-5 h-5" />
        Procurar
      </Button>
      {/* desktop filters */}
      <div className="hidden md:flex gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default" className="gap-1">
              <ListFilterIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {Capitalize(searchParams.get("filter")) || "Filtrar por"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filters.map((filter) => (
              <DropdownMenuCheckboxItem
                key={filter.value}
                checked={searchParams.get("filter") === filter.value}
                onClick={() => handleFilter(filter.value)}
              >
                {filter.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default" className="gap-1">
              <ListFilterIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {Capitalize(searchParams.get("type")) || "Tipo de imóvel"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tipo de imóvel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {types.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={searchParams.get("type") === type.value}
                onClick={() => handleType(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {hasFilters ? (
        <Button
          onClick={clearFilters}
          variant="secondary"
          className="flex items-center gap-2 animate-fadeIn"
        >
          <Label className="cursor-pointer">Limpar filtros</Label>
          <XIcon className="h-4 w-4" />
        </Button>
      ) : null}
    </>
  );
}
