import { headers } from "next/headers";

export async function isMobile() {
  const headersStore = await headers();
  const agent = headersStore.get("user-agent") as any;

  const mobileRegex =
    /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|Mobile|Windows Phone|webOS/i;

  const isMobile = mobileRegex.test(agent);
  return isMobile;
}
