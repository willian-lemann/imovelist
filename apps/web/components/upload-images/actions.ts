"use server";

import { getUser } from "@/data-access/user/get-user";
import { supabaseDB } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function uploadImageAction(prevState: any, files: FileList) {
  const { userId } = await auth();
  const loggedUser = await getUser({ id: userId! });

  let uploadedFiles = [];

  for (const file of files) {
    const fileName = `${file.name}-${loggedUser.id}`;

    await supabaseDB.storage.from("listing-images").upload(fileName, file);

    const url = `https://digdpilwqusbkpnnbejk.supabase.co/storage/v1/object/public/listing-images/${encodeURIComponent(fileName)}`;

    await supabaseDB
      .from("gallery")
      .insert({ imageUrl: url, userId: loggedUser.id });

    uploadedFiles.push(url);
  }

  return { error: "", success: true, uploadedFiles };
}
