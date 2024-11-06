"use server";

import { cookies } from "next/headers";

export async function setListingsCount(count: number) {
  const cookiesStore = await cookies();
  cookiesStore.set({
    name: "listings_count",
    value: count.toString(),
    httpOnly: false,
    path: "/",
  });
}
