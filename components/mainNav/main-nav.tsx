"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeModeToggle } from "@/components/theme/theme-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Cpu, LogOut, Database } from "lucide-react";
import { signOut } from "next-auth/react";
import { GoogleSignInButton } from "./google-signin-button";
import { MainNavBreadcrumb } from "./breadcrumb";

interface MainNavProps {
  user: {
    name: string;
    email: string;
    image: string;
  } | null;
}

export function MainNav({ user }: MainNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors hover:opacity-90"
          >
            <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                FilesDrive
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Cloud Storage
              </span>
            </div>
          </Link>

          {/* Breadcrumb */}
          <MainNavBreadcrumb />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-2">
              <GoogleSignInButton />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-background p-1 hover:bg-accent transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      {user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium pr-2 hidden sm:inline-block">
                    {user?.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="font-normal text-muted-foreground">
                    Signed in as
                  </span>
                  <span className="font-medium truncate">{user?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <Icons.user className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={() => signOut()}
                >
                  <Icons.close className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeModeToggle />
        </div>
      </nav>
    </header>
  );
}
