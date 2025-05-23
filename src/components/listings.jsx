"use client";

import { useState } from "react";
import { ListingItem } from "./listing-item";
import { List } from "lucide-react";

import { ScrollToTopButton } from "../components/scroll-top-button";
import { Label } from "../components/ui/label";

import { Pagination } from "./ui/pagination";
import { CustomPagination } from "./custom-pagination";
import { useRouter } from "next/navigation";

export function Listings({ listings, count }) {
  const router = useRouter();

  const isLogged = true;
  const mobile = true;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const numberOfPages = Math.ceil(Number(count) / pageSize);

  const maxPagesToShow = 10;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(numberOfPages, startPage + maxPagesToShow - 1);

  const shouldShowPagination = count > 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push(`?page=${page}`);
  };

  return (
    <div className="mt-4">
      <div className="px-0">
        <Label className="font-medium text-base">
          <Label className="font-bold text-base pr-2 text-muted-foreground">
            {count}
          </Label>
          Resultados encontrados para esta pesquisa
        </Label>
      </div>

      {count === 0 ? (
        <div className="group-data-[loading=true]:bg-black flex flex-col items-center justify-center gap-6 py-16 md:py-24 lg:py-32">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <List className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Nenhum resultado encontrado
            </h2>
            <p className="text-muted-foreground">
              Não encontramos nenhum anúncio com os filtros aplicados.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:container gap-6">
          {listings.map((listing) => (
            <ListingItem
              key={listing.id}
              listing={listing}
              isLogged={isLogged}
            />
          ))}
        </div>
      )}

      {shouldShowPagination && (
        <CustomPagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={numberOfPages}
          startPage={startPage}
          endPage={endPage}
          maxPageToShow={maxPagesToShow}
        />
      )}

      <ScrollToTopButton />
    </div>
  );
}
