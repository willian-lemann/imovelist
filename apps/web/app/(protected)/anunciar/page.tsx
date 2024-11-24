import { ListingForm } from "@/components/listing-form";
import { getGalleryImages } from "@/data-access/images/get-gallery-images";
import { getUser } from "@/data-access/user/get-user";

import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth.protect();
  const loggedUser = await getUser({ id: userId });

  const galleryImages = await getGalleryImages(loggedUser.id);

  return <ListingForm galleryImages={galleryImages} />;
}
