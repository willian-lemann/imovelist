import { supabaseDB } from "@/lib/supabase";

import { cache } from "react";

type Params = {
  page: number;
  query: string;
  filter: string;
  type: string;
  agentId: number;
};

const pageSize = 12;

export const getListingsFromAgent = cache(async (params: Params) => {
  const { filter, page, query, type, agentId } = params;

  const offset = (+page - 1) * pageSize;

  let queryRaw = supabaseDB
    .from("listings")
    .select("*", { count: "exact" })
    .order("agent_id", { nullsFirst: false })
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

  const listings = response.data?.map((listing) => {
    return {
      ...listing,
      isOnwer: agentId === listing.agent_id,
    };
  });

  return { count: response.count, data: listings };
});
