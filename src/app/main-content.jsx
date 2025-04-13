"use client";

import { Listings } from "@/components/listings";
import { Search } from "@/components/search";
import { useCallback, useState } from "react";

export function MainContent({ listings, count }) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="container p-0">
        <div className="py-4">
          <Search
            search={search}
            onChangeSearch={onChangeSearch}
            setIsLoading={setIsLoading}
          />
        </div>

        <div
          data-loading={isLoading}
          className="mt-0 container data-[loading=true]:opacity-50 data-[loading=true]:pointer-events-none transition-all duration-200"
        >
          <Listings listings={listings} count={count} />
        </div>
      </div>
    </div>
  );
}
