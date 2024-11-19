"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileX, Pencil, Trash } from "lucide-react";
import { formatBytes, getFileIcon } from "@/lib/utils";
import parse from "html-react-parser"; // Add this import at the top
import { Upload } from "@/queries";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { deleteServerUpload, downloadFile } from "@/app/dashboard/actions";
import { useQueryClient } from "@tanstack/react-query";
import { NoUploads } from "./no-uploads";
import { useState } from "react";
import { DeleteAnimation } from "./delete-animation";

type SortConfig = {
  column: keyof Upload | null;
  direction: "asc" | "desc";
};

interface UploadsTableProps {
  uploads?: Upload[];
  searchText: string;
  fileType: string | null;
  sizeRange: [number, number] | null;
  dateRange: [Date, Date] | null;
  sort: SortConfig;
  onSortChange: (sort: SortConfig) => void;
}

export function UploadsTable({
  uploads,
  sort,
  onSortChange,
}: UploadsTableProps) {
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const handleSort = (column: keyof Upload) => {
    onSortChange({
      column,
      direction:
        sort.column === column && sort.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleDeleteUpload = async (upload: Upload) => {
    setDeletingFiles((prev) => new Set([...prev, upload.id]));

    const deletedUpload = await deleteServerUpload({
      where: { id: upload.id },
      select: { id: true, key: true },
    });

    if (!deletedUpload) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "An error occurred while deleting the upload",
      });
    } else {
      toast({
        title: "Upload deleted",
        description: "The upload has been deleted successfully",
      });
    }

    setDeletingFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(upload.id);
      return newSet;
    });

    queryClient.invalidateQueries({ queryKey: ["userUploads"] });
  };

  if (!uploads?.length) return <NoUploads />;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] text-center">#</TableHead>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="hover:bg-transparent -ml-4"
                >
                  Name
                  <ArrowUpDown
                    className={cn(
                      "ml-2 h-4 w-4",
                      sort.column === "name" && "text-primary"
                    )}
                  />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("size")}
                  className="hover:bg-transparent -ml-4"
                >
                  Size
                  <ArrowUpDown
                    className={cn(
                      "ml-2 h-4 w-4",
                      sort.column === "size" && "text-primary"
                    )}
                  />
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("type")}
                  className="hover:bg-transparent -ml-4"
                >
                  Type
                  <ArrowUpDown
                    className={cn(
                      "ml-2 h-4 w-4",
                      sort.column === "type" && "text-primary"
                    )}
                  />
                </Button>
              </TableHead>
              <TableHead className="w-[200px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("key")}
                  className="hover:bg-transparent -ml-4"
                >
                  Key
                  <ArrowUpDown
                    className={cn(
                      "ml-2 h-4 w-4",
                      sort.column === "key" && "text-primary"
                    )}
                  />
                </Button>
              </TableHead>
              <TableHead className="w-[180px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="hover:bg-transparent -ml-4"
                >
                  Uploaded
                  <ArrowUpDown
                    className={cn(
                      "ml-2 h-4 w-4",
                      sort.column === "createdAt" && "text-primary"
                    )}
                  />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads?.map((file, idx) => (
              <DeleteAnimation
                key={file.id}
                isDeleting={deletingFiles.has(file.id)}
                isTableRow
              >
                <tr className="group hover:bg-muted/50 transition-colors">
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[300px]">
                      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary/10">
                        {parse(getFileIcon(file.type.split("/")[1]))}
                      </div>
                      <span className="truncate font-medium" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatBytes(file.size)}
                  </TableCell>
                  <TableCell>
                    <span
                      className="truncate block max-w-[120px]"
                      title={file.type}
                    >
                      {file.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className="truncate block max-w-[120px]"
                      title={file.id}
                    >
                      {file.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(file.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={file.id ? "outline" : "destructive"}
                      className="w-fit"
                    >
                      Uploaded
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          downloadFile({
                            where: { id: file.id },
                            select: { id: true, key: true },
                          })
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => handleDeleteUpload(file)}
                        disabled={deletingFiles.has(file.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </tr>
              </DeleteAnimation>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="text-sm text-muted-foreground">
                    Showing {uploads.length} files
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total size:{" "}
                    {formatBytes(
                      uploads.reduce((acc, file) => acc + file.size, 0)
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
