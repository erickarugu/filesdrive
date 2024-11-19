"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FloatingUploadButtonProps {
  progress?: number;
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function FloatingUploadButton({
  progress = 0,
  isUploading,
  onUpload,
}: FloatingUploadButtonProps) {
  return (
    <div className="fixed bottom-6 right-6">
      <div className="relative">
        <Input
          id="floatingFileUpload"
          type="file"
          className="hidden"
          onChange={onUpload}
          disabled={isUploading}
        />
        <Button
          asChild
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full",
            "bg-primary hover:bg-primary/90",
            "text-primary-foreground",
            "shadow-lg hover:shadow-primary/25",
            "transition-all duration-300"
          )}
          disabled={isUploading}
        >
          <label
            htmlFor="floatingFileUpload"
            className="cursor-pointer w-full h-full flex items-center justify-center"
          >
            {isUploading ? (
              <div className="text-xs font-medium">{progress.toFixed(0)}%</div>
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </label>
        </Button>
      </div>
    </div>
  );
}
