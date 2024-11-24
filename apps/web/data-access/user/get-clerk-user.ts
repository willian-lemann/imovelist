import { clerkClient } from "@clerk/nextjs/server";

export async function getClerkUser(userId: string) {
  const clerkResponse = await clerkClient();
  return clerkResponse.users.getUser(userId);
}
