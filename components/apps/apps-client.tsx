"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/components/hooks/queries";
import { getCurrentUser, getUserApps } from "@/app/dashboard/actions";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppCard } from "./app-card";
import { CreateAppDialog } from "./create-app-dialog";
import { AppsSkeleton } from "./apps-skeleton";

export function AppsClient() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAppId, setNewAppId] = useState<string | null>(null);
  const { useQuery } = useApi();

  const { data: apps, isPending } = useQuery({
    queryKey: ["userApps"],
    queryFn: async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser?.id) return [];

      return await getUserApps({
        where: {
          userId: currentUser.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          uploads: {
            select: {
              size: true,
            },
          },
          _count: {
            select: {
              uploads: true,
            },
          },
        },
      });
    },
  });

  // Add confetti effect when a new app is created
  useEffect(() => {
    if (newAppId) {
      const timer = setTimeout(() => {
        setNewAppId(null);
      }, 5000); // Reset after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [newAppId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Apps</h1>
          <p className="text-muted-foreground">
            Manage your applications and their associated files
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create App
        </Button>
      </div>

      {isPending && <AppsSkeleton />}
      {!isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps?.map((app, index) => (
            <AppCard
              key={app.id}
              app={app}
              filesCount={app?._count?.uploads ?? 0}
              totalStorage={app?._sum?.uploads.size ?? 0}
              index={index}
              isNew={app.id === newAppId}
            />
          ))}
        </div>
      )}

      <CreateAppDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(appId) => setNewAppId(appId)}
      />
    </div>
  );
}
