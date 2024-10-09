import { supabaseDB } from "@/lib/supabase";

export async function getListing(id: number) {
  const { data: listing } = await supabaseDB
    .from("listings")
    .select("*")
    .filter("id", "eq", id)
    .single();

  return listing;
}
