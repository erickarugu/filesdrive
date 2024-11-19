"use client";

import { useState, useCallback, useEffect } from "react";
import { CloudUpload, X } from "lucide-react";
import { Button } from "../ui/button";

interface UploadOverlayProps {
  onUpload: (files: FileList) => Promise<void>;
  isUploading: boolean;
}

export function UploadOverlay({ onUpload, isUploading }: UploadOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0 && !isUploading) {
        onUpload(files);
      }
    },
    [onUpload, isUploading]
  );

  useEffect(() => {
    const events = ["dragenter", "dragover", "dragleave", "drop"];

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleDrag as EventListener);
    });

    window.addEventListener("drop", handleDrop as EventListener);

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleDrag as EventListener);
      });

      window.removeEventListener("drop", handleDrop as EventListener);
    };
  }, [handleDrag, handleDrop]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50"
        onClick={() => setIsDragging(false)}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Upload area */}
      <div className="absolute inset-6 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center animate-in fade-in-50">
          <div className="p-4 rounded-full bg-primary/10">
            <CloudUpload className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Drop your files here</h3>
            <p className="text-muted-foreground">
              Drop anywhere to upload your files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
