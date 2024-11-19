import { AppsClient } from "@/components/apps/apps-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <AppsClient />
    </main>
  );
}
