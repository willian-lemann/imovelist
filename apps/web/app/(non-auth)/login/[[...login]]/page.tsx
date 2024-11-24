import { isMobile } from "@/app/utils/check-responsive";
import { SignIn } from "@/components/sign-in";

export default async function LoginPage() {
  const mobile = await isMobile();

  return <SignIn mobile={mobile} />;
}
