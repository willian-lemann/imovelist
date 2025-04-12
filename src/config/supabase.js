import { createBrowserClient, createServerClient } from "@supabase/ssr";

let dbClient = null;

export async function createClient() {
  if (!dbClient) {
    dbClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return dbClient;
}
