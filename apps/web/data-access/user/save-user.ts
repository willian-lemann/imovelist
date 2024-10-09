import { supabaseDB } from "@/lib/supabase";

type SaveUserDTO = {
  userId: string;
  fullName: string;
  email: string;
};

export async function saveUser({ email, fullName, userId }: SaveUserDTO) {
  const response = await supabaseDB
    .from("users")
    .insert({ userAuthId: userId, fullName, email });
  return response;
}
