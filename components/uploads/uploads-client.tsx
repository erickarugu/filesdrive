"use client";

import { useState } from "react";
import { UploadsHead } from "./uploads-head";
import { UploadsTable } from "./uploads-table";
import { useApi } from "@/components/hooks/queries";
import { getUserUploads, getCurrentUser } from "@/app/dashboard/actions";
import { Upload } from "@/queries";
import { UploadsGrid } from "./uploads-grid";
import { GridSkeleton } from "./uploads-skeleton";
import { TableSkeleton } from "./uploads-skeleton";

type SortConfig = {
  column: keyof Upload | null;
  direction: "asc" | "desc";
};

interface UploadsClientProps {
  appId: string;
}

export function UploadsClient({ appId }: UploadsClientProps) {
  const [searchText, setSearchText] = useState("");
  const [fileType, setFileType] = useState<string | null>(null);
  const [sizeRange, setSizeRange] = useState<[number, number] | null>(null);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [sort, setSort] = useState<SortConfig>({
    column: "createdAt",
    direction: "desc",
  });
  const { useQuery } = useApi();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const { data: availableTypes = [] } = useQuery({
    queryKey: ["fileTypes"],
    queryFn: async () => {
      const uploads = await getUserUploads({
        where: {
          userId: (await getCurrentUser())?.id,
        },
      });
      const types = [...new Set(uploads.map((upload) => upload.type))];
      return types.sort();
    },
  });

  const { data: uploads, isPending } = useQuery({
    queryKey: [
      "userUploads",
      appId,
      searchText,
      fileType,
      sizeRange,
      dateRange,
      sort,
    ],
    queryFn: async () => {
      const results = await getUserUploads({
        where: {
          userId: (await getCurrentUser())?.id,
          appId: appId,
          ...(searchText.length > 0
            ? {
                OR: [
                  { key: { contains: searchText, mode: "insensitive" } },
                  { name: { contains: searchText, mode: "insensitive" } },
                ],
              }
            : {}),
          ...(fileType
            ? {
                type: {
                  contains: fileType,
                  mode: "insensitive",
                },
              }
            : {}),
          ...(dateRange
            ? {
                createdAt: {
                  gte: dateRange[0],
                  lte: dateRange[1],
                },
              }
            : {}),
        },
        orderBy: sort.column
          ? { [sort.column]: sort.direction }
          : { createdAt: "desc" },
      });

      if (sizeRange) {
        return results.filter(
          (file) => file.size >= sizeRange[0] && file.size <= sizeRange[1]
        );
      }

      return results;
    },
  });

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-6 w-full">
        <UploadsHead
          setSearchText={setSearchText}
          searchText={searchText}
          setFileType={setFileType}
          fileType={fileType}
          setSizeRange={setSizeRange}
          sizeRange={sizeRange}
          setDateRange={setDateRange}
          dateRange={dateRange}
          availableTypes={availableTypes}
          viewMode={viewMode}
          setViewMode={setViewMode}
          appId={appId}
        />
      </div>

      {isPending &&
        (viewMode === "table" ? <TableSkeleton /> : <GridSkeleton />)}

      {viewMode === "table" && !isPending && (
        <UploadsTable
          searchText={searchText}
          fileType={fileType}
          sizeRange={sizeRange}
          dateRange={dateRange}
          sort={sort}
          onSortChange={setSort}
          uploads={uploads}
        />
      )}

      {viewMode === "grid" && !isPending && (
        <UploadsGrid uploads={uploads ?? []} />
      )}
    </>
  );
}
