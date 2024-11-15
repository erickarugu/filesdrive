"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "./icons";

export function MainNav() {
  return (
    <div className="flex flex-row items-center justify-between gap-4 px-5 py-2 border-b border-muted-gray-100">
      <Link
        href="/"
        passHref
        className="flex items-center gap-2 text-xl font-bold"
      >
        <Icons.logo className="h-6 w-6" />
        <span>
          file
          <span className="px-0 text-red-400">Drive</span>
        </span>
      </Link>
      <div className="flex flex-row gap-3">
        <Link href="/docs" passHref>
          <Avatar>
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/26389470?v=4"
              alt="@shadcn"
            />
            <AvatarFallback>EK</AvatarFallback>
          </Avatar>
        </Link>
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
