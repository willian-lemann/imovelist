import { supabaseDB } from "@/lib/supabase";

type GetAgentsParams = {
  page: number;
  query: string;
  pageSize: number;
};

export async function getAgents({ page, query, pageSize }: GetAgentsParams) {
  const offset = (+page - 1) * pageSize;

  let queryRaw = supabaseDB.from("agent_list").select("*", { count: "exact" });

  if (query) {
    queryRaw = queryRaw.ilike("name", `%${query}%`);
  } else {
    queryRaw = queryRaw.range(offset, offset + pageSize - 1);
  }

  return await queryRaw;
}
