"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { checkIfValidUUID, cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getUserApp } from "@/app/dashboard/actions";
import { Skeleton } from "../ui/skeleton";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 max-w-[500px] overflow-hidden",
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

export function MainNavBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname?.split("/").filter(Boolean) ?? [];

  const appId = paths.length >= 1 && paths[0] === "dashboard" ? paths[1] : null;

  const { data: app, isPending: isLoadingApp } = useQuery({
    queryKey: ["app", appId],
    queryFn: async () => {
      if (!appId || !checkIfValidUUID(appId)) return null;
      return await getUserApp({
        where: { id: appId },
        select: { id: true, name: true },
      });
    },
    enabled: !!appId,
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem key="dashboard">
          <Link href="/dashboard" legacyBehavior passHref>
            <BreadcrumbLink>
              <span>Dashboard</span>
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        {paths.map((path, index) => {
          if (path === "dashboard") return null;

          // If this is an app ID in the path, use the app name instead
          const isAppId = path === appId;
          const displayText =
            isAppId && app
              ? app.name
              : path.charAt(0).toUpperCase() + path.slice(1);

          const href = `/dashboard/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;

          return (
            <React.Fragment key={path + index}>
              <BreadcrumbSeparator />
              {isLoadingApp && <Skeleton className="w-24 h-4" />}
              {!isLoadingApp && (
                <BreadcrumbItem>
                  {isLast ? (
                    <>{displayText}</>
                  ) : (
                    <Link href={href} legacyBehavior passHref>
                      <BreadcrumbLink>
                        <span>{displayText}</span>
                      </BreadcrumbLink>
                    </Link>
                  )}
                </BreadcrumbItem>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
