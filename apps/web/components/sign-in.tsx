"use client";

import { SignIn as SignInComponent } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

type SignInComponentProps = {
  mobile: boolean;
};

export function SignIn({ mobile }: SignInComponentProps) {
  const router = useRouter();
  const pathname = usePathname();

  document.addEventListener("input", () => {
    router.push(`${pathname}/?origin=modal`);
  });

  return (
    <SignInComponent
      fallbackRedirectUrl={process.env.NEXT_PUBLIC_AUTH_CALLBACK}
      appearance={{
        elements: {
          modalCloseButton: {
            zIndex: 9999,
            background: "#000",
          },

          rootBox: {
            width: mobile ? "auto" : "100%",
            border: "none",
            boxShadow: "none",
            background: "#fff",
          },
          cardBox: {
            width: mobile ? "" : "100%",
            border: "none",
            boxShadow: "none",
          },
          card: {
            border: "none",
            boxShadow: "none",
            padding: mobile ? "2rem 0rem" : "",
          },
          footer: {
            background: "#fff",
            border: "none",
            boxShadow: "none",
          },
          footerAction: {
            border: "none",
            boxShadow: "none",
          },
        },
      }}
    />
  );
}
