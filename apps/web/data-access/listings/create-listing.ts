import { supabaseDB } from "@/lib/supabase";

export type Input = {
  image: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  price: number;
  forSale: boolean;
  type: string;
  ref: string;
  placeholderImage: string;
  agent_id: number;
  content: string;
};

export async function createListing(input: Input) {
  const created = await supabaseDB.From("scrapped_listings").insert(input);
  return created;
}
