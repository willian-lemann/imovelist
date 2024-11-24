import { supabaseDB } from "@/lib/supabase";

import { cache } from "react";

type GetListingParams = {
  page: number;
  query: string;
  filter: string;
  type: string;
};

const pageSize = 12;

export const getListings = cache(
  async ({ filter, page, query, type }: GetListingParams) => {
    const offset = (+page - 1) * pageSize;

    let queryRaw = supabaseDB
      .from("listings")
      .select("*", { count: "exact" })
      .range(offset, offset + pageSize - 1);

    if (type) {
      queryRaw = queryRaw.eq(
        "type",
        type.charAt(0).toUpperCase() + type.slice(1)
      );
    }

    if (filter) {
      queryRaw = queryRaw.or(`forSale.eq.${filter !== "aluguel"}`);
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

    const response = await queryRaw;

    return {
      count: response.count,
      data: response.data,
    };
  }
);
