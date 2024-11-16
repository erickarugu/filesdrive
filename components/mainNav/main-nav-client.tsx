"use client";

import { useSession } from "next-auth/react";
import { MainNav } from "./main-nav";

export function MainNavClient() {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
      }
    : null;

  return <MainNav user={user} status={status} />;
}
