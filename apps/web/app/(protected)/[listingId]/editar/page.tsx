import { ListingForm } from "@/components/listing-form";
import { auth } from "@clerk/nextjs/server";

export default function Page() {
  auth().protect();

  return <ListingForm />;
}
