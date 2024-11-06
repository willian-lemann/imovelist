import { headers } from "next/headers";
import { userAgent } from "next/server";

export async function isMobile() {
  const agent = userAgent({ headers: await headers() });
  const isMobile = agent.device.type === "mobile";
  return isMobile;
}
