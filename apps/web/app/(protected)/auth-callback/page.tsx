import { getUser } from "@/data-access/user/get-user";
import { saveUser } from "@/data-access/save-user";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getUserFromDatabase(userId: string) {
  const user = await getUser({ id: userId });
  return user;
}

export default async function CallbackAuthPage() {
  const { userId } = auth();

  if (userId) {
    const hasUserInDatabase = await getUserFromDatabase(userId);

    if (!hasUserInDatabase) {
      const loggedUser = await clerkClient.users.getUser(userId);
      const [emailData] = loggedUser.emailAddresses;
      const email = emailData?.emailAddress!;
      const fullName = loggedUser.fullName!;

      const { error } = await saveUser({ userId, fullName, email });
      if (error) return console.log("did not save to database user", userId);
      return redirect("/");
    }

    redirect("/");
  }

  return null;
}
