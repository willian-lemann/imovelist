import { supabaseDB } from "@/lib/supabase";

type Input = {
  id: string;
  image: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  price: number;
  photos: { href: string }[];
  forSale: boolean;
  type: string;
  ref: string;
  placeholderImage: string;
  agent_id: number;
};

export async function createListing(input: Input) {
  const created = await supabaseDB.from("listings").insert(input);
}
