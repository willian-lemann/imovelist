import { isMobile } from "@/app/utils/check-responsive";
import { LoginModal } from "@/components/login-modal";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const SignIn = dynamic(() =>
  import("@/components/sign-in").then((mod) => mod.SignIn)
);

export default async function Page() {
  const mobile = await isMobile();

  return (
    <LoginModal>
      <Suspense fallback={<p>loading...</p>}>
        <SignIn mobile={mobile} />
      </Suspense>
    </LoginModal>
  );
}
