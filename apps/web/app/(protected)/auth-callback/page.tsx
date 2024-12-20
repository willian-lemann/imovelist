import { getUser } from "@/data-access/user/get-user";
import { saveUser } from "@/data-access/user/save-user";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getUserFromDatabase(userId: string) {
  const user = await getUser({ id: userId });
  return user;
}

export default async function CallbackAuthPage() {
  const { userId } = await auth();

  if (userId) {
    const hasUserInDatabase = await getUserFromDatabase(userId);

    if (!hasUserInDatabase) {
      const clerkClientResponse = await clerkClient();
      const loggedUser = await clerkClientResponse.users.getUser(userId);

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
