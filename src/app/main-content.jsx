"use client";

import { useCallback, useState } from "react";
import { cre } from "@/lib/utils";
import { Search } from "@/components/search";

import { Listings } from "@/components/listings";
import { useRouter, useSearchParams } from "next/navigation";

export function MainContent({ listings, count }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  const onChangeSearch = useCallback((value) => {
    setIsLoading(true);
    setSearch(value);

    if (value.length === 0) {
      router.push(`/`);
    }
  }, []);

  return (
    <div className="container">
      <div className="py-4">
        <Search
          search={search}
          onChangeSearch={onChangeSearch}
          setIsLoading={setIsLoading}
        />
      </div>

      <div
        data-loading={isLoading}
        className="mt-0 data-[loading=true]:opacity-50 data-[loading=true]:pointer-events-none transition-all duration-200"
      >
        <Listings listings={listings} count={count} />
      </div>
    </div>
  );
}
