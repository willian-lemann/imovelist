import { supabaseDB } from "@/lib/supabase";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { Pagination } from "@/components/pagination";
import { ListingItem } from "./listing-item";
import { List } from "lucide-react";
import { SeeMore } from "./see-more";
import { getListings } from "@/data-access/listings/get-listings";
import { ScrollToTopButton } from "@/components/scroll-top-button";
import { Label } from "@/components/ui/label";
import { getUser } from "@/data-access/user/get-user";
import { getListingsFromAgent } from "@/data-access/listings/get-listings-from-agent";
import { isMobile } from "@/app/utils/check-responsive";

const pageSize = 12;

const getListingsLimited = cache(async () => {
  return await supabaseDB.from("listings").select("*").limit(10);
});

type ListingsProps = {
  searchParams: { page: number; q: string; filter: string; type: string };
};

export async function Listings({ searchParams }: ListingsProps) {
  const { page = 1, q = "", ...filters } = searchParams;

  const { userId } = auth();

  const isLogged = !!userId;
  const mobile = await isMobile();

  const { filter, type } = filters;

  async function fetchListings() {
    if (isLogged) {
      const user = await getUser({ id: userId! });
      if (user.agent) {
        return await getListingsFromAgent({
          page: +page,
          filter,
          query: q,
          type,
          agentId: user.agent.id,
        });
      }
      return await getListings({ page: +page, filter, query: q, type });
    }

    return await getListingsLimited();
  }

  const { data, count: listingCount } = await fetchListings();

  const numberOfPages = Math.ceil(Number(listingCount) / pageSize);
  const shouldShowPagination = isLogged && data?.length! > 0;

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
          isMobile={mobile}
          numberOfPages={numberOfPages}
          page={page}
        />
      ) : null}

      {!isLogged ? <SeeMore /> : null}

      <ScrollToTopButton />
    </div>
  );
}
