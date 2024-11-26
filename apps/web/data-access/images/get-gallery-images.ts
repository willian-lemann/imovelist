import { supabaseDB } from "@/lib/supabase";

type GalleryImages = {
  id: number;
  imageUrl: string;
  userId: number;
};

export async function getGalleryImages(userId: number) {
  const { data } = await supabaseDB
    .from("gallery")
    .select("*")
    .eq("userId", userId)
    .eq("has_listing", false);

  return data as GalleryImages[];
}