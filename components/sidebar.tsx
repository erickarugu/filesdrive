import { cn } from "@/lib/utils";

export default function Sidebar({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        `relative h-screen flex-none border-r pt-20 md:block`,
        className
      )}
    >
      <div>Sidebar</div>
    </nav>
  );
}
