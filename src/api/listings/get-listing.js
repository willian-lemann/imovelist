import "server-only";

import { createClient } from "@/config/supabase";

export async function getListing(id) {
  const db = await createClient();

  const response = await db
    .from("listings")
    .select("*")
    .filter("id", "eq", id)
    .single();

  return response.data;
}
