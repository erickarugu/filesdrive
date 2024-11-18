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
import { useApi } from "@/components/hooks/queries";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash } from "lucide-react";
import { formatBytes, getFileIcon } from "@/lib/utils";
import parse from "html-react-parser"; // Add this import at the top
import { getCurrentUser, getUserUploads } from "@/app/dashboard/actions";
import { Upload } from "@/queries";

interface UploadsTableProps {
  searchText: string;
}

export function UploadsTable({ searchText }: UploadsTableProps) {
  const { useQuery } = useApi();

  const {
    data: uploads,
    isPending,
    error,
  } = useQuery({
    queryKey: ["userUploads"],
    queryFn: async (): Promise<Upload[]> =>
      await getUserUploads({
        where: {
          userId: (await getCurrentUser())?.id,
          ...(searchText.length
            ? {
                OR: [
                  { key: { contains: `%${searchText}%`, mode: "insensitive" } },
                  {
                    name: { contains: `%${searchText}%`, mode: "insensitive" },
                  },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
      }),
  });

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
      </div>
    );

  if (error) return <p>An error occurred.</p>;

  if (!uploads || !uploads.length) return <p>No uploads found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Key</TableHead>
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
            <TableCell className="font-medium flex items-center gap-2 max-w-70 overflow-hidden text-ellipsis text-nowrap">
              {parse(getFileIcon(file.type.split("/")[1]))}
              {file.name}
            </TableCell>
            <TableCell>{formatBytes(file.size)}</TableCell>
            <TableCell className="text-ellipsis text-nowrap max-w-40 overflow-hidden">
              {file.type}
            </TableCell>
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
