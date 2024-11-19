import { FileX } from "lucide-react";

export function NoUploads() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
      <FileX className="h-16 w-16 mb-4 opacity-50" />
      <p className="text-lg font-medium">No uploads found</p>
      <p className="text-sm">Upload some files to see them here</p>
    </div>
  );
}
