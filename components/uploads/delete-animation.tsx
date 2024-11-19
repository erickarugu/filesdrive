import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface DeleteAnimationProps {
  isDeleting: boolean;
  children: React.ReactNode;
  isTableRow?: boolean;
}

export function DeleteAnimation({
  isDeleting,
  children,
  isTableRow = false,
}: DeleteAnimationProps) {
  if (isTableRow) {
    return (
      <>
        {isDeleting && (
          <tr className="relative">
            <td
              colSpan={8}
              className="absolute inset-0 bg-background/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </td>
          </tr>
        )}
        {children}
      </>
    );
  }

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        isDeleting && "opacity-50 scale-95 pointer-events-none"
      )}
    >
      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {children}
    </div>
  );
}
