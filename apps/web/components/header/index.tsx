import { UserButton } from "@clerk/nextjs";
import { MountainIcon } from "lucide-react";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";

import { AnnounceButton } from "./announce-button";

export async function Header() {
  const { userId: isAuthenticated } = await auth();

  return (
    <header className="bg-background border-b">
      <div className="container py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="w-6 h-6" />
          <span className="font-bold text-lg">Imovelist</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? <AnnounceButton /> : null}

          {
            isAuthenticated ? <UserButton /> : null
            // <Button asChild className="h-auto px-5 ">
            //   <Link href={login} className="text-sm font-bold" prefetch={true}>
            //     Sou corretor
            //   </Link>
            // </Button>
          }
        </div>
      </div>
    </header>
  );
}
