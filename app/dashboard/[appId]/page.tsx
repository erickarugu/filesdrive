import { UploadsClient } from "@/components/uploads/uploads-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getApp } from "@/queries/app";

export default async function AppDashboard({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  const app = await getApp({
    where: { id: appId },
    select: { id: true, name: true },
  });

  if (!app) {
    redirect("/dashboard");
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{app.name}</h1>
        <p className="text-sm text-muted-foreground">
          Manage files for this application
        </p>
      </div>
      <div className="border rounded-lg bg-card p-4">
        <UploadsClient appId={app.id} />
      </div>
    </main>
  );
}
