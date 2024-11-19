import { App } from "@/queries/app";
import { Card, CardContent, CardHeader } from "../ui/card";
import { cn, formatBytes } from "@/lib/utils";
import { MoreVertical, File, Database, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { EditAppDialog } from "./edit-app-dialog";
import { useRouter } from "next/navigation";
import confetti, { Shape } from "canvas-confetti";
import { deleteUserApp } from "@/app/dashboard/actions";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const gradients = [
  {
    bg: "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20",
    border:
      "before:from-blue-500/50 before:to-cyan-500/50 hover:before:from-blue-500 hover:before:to-cyan-500",
    icon: "text-blue-500",
  },
  {
    bg: "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20",
    border:
      "before:from-purple-500/50 before:to-pink-500/50 hover:before:from-purple-500 hover:before:to-pink-500",
    icon: "text-purple-500",
  },
  {
    bg: "from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20",
    border:
      "before:from-orange-500/50 before:to-red-500/50 hover:before:from-orange-500 hover:before:to-red-500",
    icon: "text-orange-500",
  },
  {
    bg: "from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20",
    border:
      "before:from-green-500/50 before:to-emerald-500/50 hover:before:from-green-500 hover:before:to-emerald-500",
    icon: "text-green-500",
  },
  {
    bg: "from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20",
    border:
      "before:from-yellow-500/50 before:to-orange-500/50 hover:before:from-yellow-500 hover:before:to-orange-500",
    icon: "text-yellow-500",
  },
];

interface AppCardProps {
  app: App;
  filesCount: number;
  totalStorage: number;
  index: number;
  isNew?: boolean;
}

function fireWorkEffect(duration = 3000) {
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
        shapes: ["circle", "square"] as Shape[],
        gravity: 1.2,
        scalar: 2,
        drift: 0,
      })
    );
  }, 250);
}

export function AppCard({
  app,
  filesCount,
  totalStorage,
  index,
  isNew,
}: AppCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const router = useRouter();
  const gradientIndex = index % gradients.length;
  const gradient = gradients[gradientIndex];
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNew) {
      fireWorkEffect(4000);
    }
  }, [isNew]);

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDeleting(true);

    try {
      await deleteUserApp({ where: { id: app.id } });
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast({
        title: "App deleted",
        description: "App deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["userApps"] });
    } catch (error) {
      setIsDeleting(false);
      toast({
        variant: "destructive",
        title: "Error deleting app",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the app.",
      });
    }
  };

  return (
    <>
      <Card
        ref={cardRef}
        className={cn(
          "group relative transition-all duration-300",
          "bg-gradient-to-br",
          gradient.bg,
          "border-transparent hover:shadow-lg",
          "before:absolute before:inset-0 before:-z-10",
          "before:rounded-lg before:p-[2px]",
          "before:bg-gradient-to-br before:opacity-100",
          gradient.border,
          "before:transition-all before:duration-300",
          "hover:before:blur-sm",
          "p-[2px]",
          "cursor-pointer",
          isDeleting && "opacity-50 scale-95 pointer-events-none",
          isNew &&
            "animate-pulse ring-2 ring-orange-500 ring-offset-2 ring-offset-background"
        )}
        onClick={() => !isDeleting && router.push(`/dashboard/${app.id}`)}
      >
        <div className="bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "p-2 rounded-md bg-white/50 backdrop-blur-sm",
                  "dark:bg-black/50"
                )}
              >
                <Database className={cn("h-4 w-4", gradient.icon)} />
              </div>
              <h3 className="font-semibold">{app.name}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setIsEditOpen(true)}
                  disabled={isDeleting}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          {isDeleting && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Deleting...</p>
              </div>
            </div>
          )}

          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={cn(
                  "space-y-1 p-3 rounded-lg",
                  "bg-white/50 dark:bg-black/50",
                  "backdrop-blur-sm"
                )}
              >
                <p className="text-sm text-muted-foreground">Files</p>
                <div className="flex items-center space-x-2">
                  <File className={cn("h-4 w-4", gradient.icon)} />
                  <p className="text-lg font-semibold">{filesCount}</p>
                </div>
              </div>
              <div
                className={cn(
                  "space-y-1 p-3 rounded-lg",
                  "bg-white/50 dark:bg-black/50",
                  "backdrop-blur-sm"
                )}
              >
                <p className="text-sm text-muted-foreground">Storage</p>
                <div className="flex items-center space-x-2">
                  <Database className={cn("h-4 w-4", gradient.icon)} />
                  <p className="text-lg font-semibold">
                    {formatBytes(totalStorage)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <EditAppDialog app={app} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  );
}
