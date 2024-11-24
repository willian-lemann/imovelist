import { supabaseDB } from "@/lib/supabase";

export async function getUser({ id: userId }: { id: string }) {
  if (!userId) return null;

  const { data: user } = await supabaseDB
    .from("users")
    .select("*, agents(*)")
    .eq("userAuthId", userId)
    .single()
    .then((res) => {
      if (res.error) return { ...res, data: null };

      const { agents, ...restUser } = res.data;
      const [agent] = agents;
      return {
        ...res,
        data: {
          ...restUser,
          agent: agent ?? null,
        },
      };
    });

  return user;
}
