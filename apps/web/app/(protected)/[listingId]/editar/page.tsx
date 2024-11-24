import { ListingForm } from "@/components/listing-form";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  await auth.protect();

  return <ListingForm />;
}
