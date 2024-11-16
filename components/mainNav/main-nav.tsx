"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ThemeModeToggle } from "../theme-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "../icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleSignInButton } from "./google-signin-button";
import { BreadcrumbWithCustomSeparator } from "./breadcrumb";

interface MainNavProps {
  user: {
    name: string;
    email: string;
    image: string;
  } | null;
  status: "loading" | "unauthenticated" | "authenticated";
}

export function MainNav({ user, status }: MainNavProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 px-5 py-2 border-b border-muted-gray-100">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          passHref
          className="flex items-center gap-2 text-xl font-bold"
        >
          <Icons.logo className="h-6 w-6" />
          <span>
            files
            <span className="px-0 text-red-400">Drive</span>
          </span>
        </Link>
        {/* Add a breadcrumb */}
        <BreadcrumbWithCustomSeparator />
      </div>

      <div className="flex flex-row gap-3">
        {!user && status === "unauthenticated" ? (
          <GoogleSignInButton />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {status === "loading" ? (
                <Skeleton className="w-10 h-10 rounded-full" />
              ) : (
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <Icons.user className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Icons.settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ThemeModeToggle />
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
