import { getListings } from "@/api/listings/get-listings";
import { Listings } from "@/components/listings";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { AppProvider } from "@/providers/app-provider";

export default async function Home({ searchParams }) {
  const { filter, type, page, q } = await searchParams;

  const { data: listings, count } = await getListings({
    search: q ?? undefined,
    page: page ?? 1,
    limit: 12,
    filter: filter ?? undefined,
    type: type ?? undefined,
  });

  return (
    <AppProvider>
      <div>
        <header class="bg-background border-b py-4">
          <div class="container py-4 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"
                />
              </svg>
              <span class="font-bold text-lg">Imovelist</span>
            </a>

            <div class="flex items-center gap-4">
              {/* <a href="/announce" class="btn">
                Anunciar
              </a> */}

              <Button variant="outline">Login</Button>

              {/* <a href="/login" class="btn">
                Sou corretor
              </a> */}
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          <div className="container p-0">
            <div className="py-4">{<Search />}</div>

            <div className="mt-0 container">
              <Listings listings={listings} count={count} />
            </div>
          </div>
        </div>
        {/* <LoginModal>
        <SignIn mobile={mobile} />
      </LoginModal> */}
      </div>
    </AppProvider>
  );
}
