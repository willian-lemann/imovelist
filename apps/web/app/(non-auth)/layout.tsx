import Image from "next/image";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 px-40">
        {children}
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/background.jpeg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
