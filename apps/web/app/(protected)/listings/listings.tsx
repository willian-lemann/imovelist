import { supabaseDB } from "@/lib/supabase";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { ListingPagination } from "./pagination";
import { ListingItem } from "./listing-item";
import { List } from "lucide-react";
import { SeeMore } from "./see-more";

const pageSize = 12;

const getListingsLimited = cache(async () => {
  return await supabaseDB.from("listings").select("*").limit(10);
});

type GetListingParams = {
  page: number;
  query: string;
  filter: string;
  type: string;
};

const getListings = cache(
  async ({ filter, page, query, type }: GetListingParams) => {
    const offset = (+page - 1) * pageSize;

    let queryRaw = supabaseDB
      .from("listings")
      .select("*", { count: "exact" })
      .range(offset, offset + pageSize - 1);

    if (type) {
      queryRaw = queryRaw.eq("type", type);
    }

    if (filter) {
      queryRaw = queryRaw.or(`forSale.eq.${filter !== "Aluguel"}`);
    }

    if (query) {
      const isQuerySearch = isNaN(Number(query));

      if (!isQuerySearch) {
        queryRaw = queryRaw.or(`ref.eq.${query}, id.eq.${query}`);
      } else {
        queryRaw = queryRaw.textSearch("address", query, {
          type: "websearch",
        });
      }
    }

    return await queryRaw;
  }
);

type ListingsProps = {
  searchParams: { page: number; q: string; filter: string; type: string };
};

export async function Listings({
  searchParams: { page = 1, q = "", ...filters },
}: ListingsProps) {
  const { userId } = auth();
  const isLogged = !!userId;

  const { filter, type } = filters;

  const { data, count: listingCount } = isLogged
    ? await getListings({ page: +page, filter, query: q, type })
    : await getListingsLimited();

  const numberOfPages = Math.ceil(Number(listingCount) / pageSize);
  const shouldShowPagination = isLogged && data?.length! > 0;

  return (
    <div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 container gap-6">
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
        <ListingPagination numberOfPages={numberOfPages} page={page} />
      ) : null}

      {!isLogged ? <SeeMore /> : null}
    </div>
  );
}