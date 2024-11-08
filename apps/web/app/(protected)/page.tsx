// @next-codemod-ignore
import { Listings } from "@/app/(protected)/listings/listings";

import { Search } from "@/components/search";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { Skeleton } from "./listings/skeleton";
import { LoginModal } from "@/components/login-modal";
import { SignIn } from "@/components/sign-in";

type HomePageProps = {
  searchParams: Promise<{
    page: number;
    q: string;
    filter: string;
    type: string;
    show_login: string;
  }>;
};

export default async function HomePage(props: HomePageProps) {
  const searchParams = await props.searchParams;
  const { userId: isLogged } = auth();

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="container p-0">
          <div className="py-4">{isLogged ? <Search /> : null}</div>

          <div className="mt-0">
            <Suspense fallback={<Skeleton />}>
              <Listings searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
      <LoginModal>
        <SignIn />
      </LoginModal>
    </>
  );
}
