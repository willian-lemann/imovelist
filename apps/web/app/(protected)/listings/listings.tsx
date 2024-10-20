import { supabaseDB } from "@/lib/supabase";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { Pagination } from "@/components/pagination";
import { ListingItem } from "./listing-item";
import { List } from "lucide-react";
import { SeeMore } from "./see-more";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { getListings } from "@/data-access/get-listings";
import { ScrollToTopButton } from "@/components/scroll-top-button";
import { Label } from "@/components/ui/label";

const pageSize = 12;

const getListingsLimited = cache(async () => {
  return await supabaseDB.from("listings").select("*").limit(10);
});

type ListingsProps = {
  searchParams: { page: number; q: string; filter: string; type: string };
};

export async function Listings({
  searchParams: { page = 1, q = "", ...filters },
}: ListingsProps) {
  const { userId } = auth();
  const agent = userAgent({ headers: headers() });

  const isLogged = !!userId;
  const isMobile = agent.device.type === "mobile";

  const { filter, type } = filters;

  const { data, count: listingCount } = await getListings({
    page: +page,
    filter,
    query: q,
    type,
  });

  const numberOfPages = Math.ceil(Number(listingCount) / pageSize);
  const shouldShowPagination = data?.length! > 0;

  return (
    <div>
      {isLogged ? (
        <div className="container pb-4">
          <Label className="text-lg  font-medium">
            <Label className="font-bold text-lg text-muted-foreground">
              {listingCount}
            </Label>{" "}
            Resultados encontrados para esta pesquisa
          </Label>
        </div>
      ) : null}
      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-16 md:py-24 lg:py-32">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 md:container gap-6">
          {data?.map((listing) => (
            <ListingItem
              key={listing.id}
              listing={listing}
              isLogged={isLogged}
            />
          ))}
        </div>
      )}

      {shouldShowPagination ? (
        <Pagination
          isMobile={isMobile}
          numberOfPages={numberOfPages}
          page={page}
        />
      ) : null}

      {/* <SeeMore /> */}

      <ScrollToTopButton />
    </div>
  );
}
