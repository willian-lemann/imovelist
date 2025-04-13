import { getListing } from "@/api/listings/get-listing";
import ListingDetails from "./page";
import { extractIdFromSlug } from "@/lib/utils";

export async function generateMetadata(props, parent) {
  const params = await props.params;
  const id = extractIdFromSlug(params.slug);

  const listing = await getListing(id);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${createSlug(listing.address)}-${listing.id}`,
    openGraph: {
      images: [...previousImages, listing.image],
    },
  };
}

export default async function Layout({ params }) {
  const { slug } = await params;
  const id = extractIdFromSlug(slug);
  const listing = await getListing(id);

  return <ListingDetails listing={listing} />;
}
