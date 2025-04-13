import { getListings } from "@/api/listings/get-listings";

import { Button } from "@/components/ui/button";
import { AppProvider } from "@/providers/app-provider";
import { MainContent } from "./main-content";

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
        <header className="bg-background border-b py-4">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
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
              <span className="font-bold text-lg">Imovelist</span>
            </a>

            <div className="flex items-center gap-4">
              {/* <a href="/announce" className="btn">
                Anunciar
              </a> */}

              {/* <Button variant="outline">Login</Button> */}

              {/* <a href="/login" className="btn">
                Sou corretor
              </a> */}
            </div>
          </div>
        </header>

        <MainContent listings={listings} count={count} />
        {/* <LoginModal>
        <SignIn mobile={mobile} />
      </LoginModal> */}
      </div>
    </AppProvider>
  );
}
