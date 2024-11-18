import { UploadsClient } from "@/components/uploads/uploads-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex flex-row items-center justify-between max-w-screen-2xl mx-auto">
      <div className="flex flex-col mx-auto mt-3 border border-muted-gray-100 bg-muted-gray-100 p-4 shadow-sm w-full">
        <UploadsClient />
      </div>
    </main>
  );
}
