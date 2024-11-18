import { MainNav } from "./main-nav";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function MainNavClient() {
  const session = await getServerSession(authOptions);

  const user = session?.user
    ? {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
      }
    : null;

  return <MainNav user={user} />;
}
