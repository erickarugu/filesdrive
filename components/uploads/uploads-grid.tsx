import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "../ui/use-toast";
import { deleteServerUpload } from "@/app/dashboard/actions";
import { DeleteAnimation } from "./delete-animation";
import { Upload } from "@/queries";
import { formatBytes, getFileIcon } from "@/lib/utils";
import parse from "html-react-parser";
import { Button } from "../ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import { NoUploads } from "./no-uploads";

interface UploadsGridProps {
  uploads: Upload[];
}

export function UploadsGrid({ uploads }: UploadsGridProps) {
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const handleDelete = async (file: Upload) => {
    setDeletingFiles((prev) => new Set([...prev, file.id]));

    try {
      await deleteServerUpload({
        where: { id: file.id },
        select: { id: true },
      });

      // Add a slight delay for the animation
      await new Promise((resolve) => setTimeout(resolve, 300));

      queryClient.invalidateQueries({ queryKey: ["userUploads"] });
      toast({
        title: "File deleted",
        description: "File deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting file",
        description: "An error occurred while deleting the file.",
      });
    }

    setDeletingFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(file.id);
      return newSet;
    });
  };

  if (!uploads?.length) return <NoUploads />;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {uploads.map((file) => (
        <DeleteAnimation key={file.id} isDeleting={deletingFiles.has(file.id)}>
          <div className="group relative bg-card rounded-lg border p-3 hover:shadow-md transition-all">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 flex items-center justify-center rounded-md bg-primary/10">
                {parse(getFileIcon(file.type.split("/")[1]))}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium truncate text-sm" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatBytes(file.size)}
              </p>
              <Badge variant="outline" className="w-fit text-xs">
                {file.type.split("/")[1].toUpperCase()}
              </Badge>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(file)}
                  disabled={deletingFiles.has(file.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DeleteAnimation>
      ))}
    </div>
  );
}
