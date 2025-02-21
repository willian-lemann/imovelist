"use client";

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useRouter } from "next/navigation";

export type ListingPaginationProps = {
  numberOfPages: number;
  page: number;
  isMobile: boolean;
};

export function Pagination({
  page,
  numberOfPages,
  isMobile,
}: ListingPaginationProps) {
  const router = useRouter();

  function handlePage(page: number) {
    // searchparams.set("page", page.toString());
    router.push(`?page=${page}`);
  }

  function handleGoPrev() {
    if (page > 1) {
      handlePage(page - 1);
    }
  }

  function handleGoNext() {
    if (page < numberOfPages) {
      handlePage(page + 1);
    }
  }

  const limit = isMobile ? 5 : 10;
  const startPage = Math.max(1, page - Math.floor(limit / 2));
  const endPage = Math.min(startPage + limit - 1, numberOfPages);

  return (
    <PaginationComponent className="py-10 md:flex">
      <PaginationContent>
        {startPage >= 10 ? (
          <PaginationItem className="hidden md:block">
            <PaginationLink
              variant="outline"
              className="px-10"
              isActive={page === 1}
              onClick={() => handlePage(1)}
            >
              Inicio
            </PaginationLink>
          </PaginationItem>
        ) : null}

        <PaginationItem className="px-3 md:px-0">
          <PaginationPrevious variant="outline" onClick={handleGoPrev} />
        </PaginationItem>

        {Array.from({
          length: endPage - startPage + 1,
        }).map((_, index) => (
          <PaginationItem key={startPage + index}>
            <PaginationLink
              variant="outline"
              isActive={startPage + index === page}
              onClick={() => handlePage(startPage + index)}
            >
              {startPage + index}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < numberOfPages && (
          <PaginationItem className="hidden md:block">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem className="px-3 md:px-0">
          <PaginationNext variant="outline" onClick={handleGoNext} />
        </PaginationItem>

        <PaginationItem className="hidden md:block">
          <PaginationLink
            className="px-10"
            variant="outline"
            isActive={page === numberOfPages}
            onClick={() => handlePage(numberOfPages)}
          >
            Última
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}
