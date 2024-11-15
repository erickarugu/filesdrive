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
import { useApi } from "./hooks/queries";
import { Badge } from "./ui/badge";
import { Eye, Pencil, Trash } from "lucide-react";

export function UploadsTable() {
  const { get, useQuery } = useApi();

  const {
    data: uploads,
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["uploads"],
    queryFn: () => get("/uploads"),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
      </div>
    );

  if (error) return <p>An error occurred.</p>;

  if (!uploads || !uploads.length) return <p>No uploads found</p>;

  console.log({ uploads });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Cusonm Id</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody
        className="
      text-ellipsis text-nowrap
      "
      >
        {uploads?.map((file, idx) => (
          <TableRow key={file.id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell className="font-medium">{file.filename}</TableCell>
            <TableCell>{(Math.random() * 10).toFixed(2) + "MB"}</TableCell>
            <TableCell>Image/JPEG</TableCell>
            <TableCell>{file.url}</TableCell>
            <TableCell>{file.id}</TableCell>
            <TableCell>{new Date(file.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={file.id ? "outline" : "destructive"}>
                Uploaded
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Eye strokeWidth={0.75} size={20} className="cursor-pointer" />
                <Pencil
                  strokeWidth={0.75}
                  size={20}
                  className="cursor-pointer"
                />
                <Trash
                  strokeWidth={0.75}
                  size={20}
                  className="cursor-pointer"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* TODO: Add number pagination */}
        <TableRow>
          <TableCell colSpan={9}>
            <div className="flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                No more files to show
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
