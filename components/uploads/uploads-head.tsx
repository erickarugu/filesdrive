"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import FileUpload from "./file-upload";
import { File, ChevronDown, LayoutGrid, LayoutList } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UploadsHeadProps {
  setSearchText: (text: string) => void;
  searchText: string;
  setFileType: (type: string | null) => void;
  fileType: string | null;
  setSizeRange: (range: [number, number] | null) => void;
  sizeRange: [number, number] | null;
  availableTypes: string[];
  setDateRange: (range: [Date, Date] | null) => void;
  dateRange: [Date, Date] | null;
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  appId: string;
}

const sizeRanges = [
  { label: "All Sizes", value: null },
  { label: "< 1MB", value: [0, 1024 * 1024] },
  { label: "1MB - 10MB", value: [1024 * 1024, 10 * 1024 * 1024] },
  { label: "10MB - 100MB", value: [10 * 1024 * 1024, 100 * 1024 * 1024] },
  { label: "100MB - 1GB", value: [100 * 1024 * 1024, 1024 * 1024 * 1024] },
  { label: "> 1GB", value: [1024 * 1024 * 1024, Infinity] },
] as const;

const dateRanges = [
  { label: "All Time", value: null },
  {
    label: "Last 24 Hours",
    value: [new Date(Date.now() - 86400000), new Date()],
  },
  {
    label: "Last 7 Days",
    value: [new Date(Date.now() - 7 * 86400000), new Date()],
  },
  {
    label: "Last 30 Days",
    value: [new Date(Date.now() - 30 * 86400000), new Date()],
  },
  {
    label: "Last 90 Days",
    value: [new Date(Date.now() - 90 * 86400000), new Date()],
  },
] as const;

const fileTypes = [
  { label: "All Types", value: null },
  { label: "PDF", value: "pdf" },
  { label: "Document", value: "doc" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
] as const;

export function UploadsHead({
  setSearchText,
  searchText,
  setFileType,
  fileType,
  setSizeRange,
  sizeRange,
  setDateRange,
  dateRange,
  viewMode,
  setViewMode,
  appId,
}: UploadsHeadProps) {
  const [inputValue, setInputValue] = useState(searchText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchText]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="space-y-6 mb-6 flex-grow">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <File className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Files</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-xl">
            Manage and organize your uploaded files
          </p>
        </div>
        <div className="flex items-end align-top gap-2">
          <FileUpload appId={appId} />
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files by name..."
            className="w-full pl-9 focus-visible:ring-1"
            value={inputValue}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[100px]",
                fileType && "bg-primary/10 text-primary"
              )}
            >
              Type
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup
              value={fileType ?? ""}
              onValueChange={(value) => setFileType(value || null)}
            >
              {fileTypes.map((type) => (
                <DropdownMenuRadioItem
                  key={type.label}
                  value={type.value ?? ""}
                >
                  {type.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[100px]",
                sizeRange && "bg-primary/10 text-primary"
              )}
            >
              Size
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup
              value={sizeRange ? `${sizeRange[0]}-${sizeRange[1]}` : ""}
              onValueChange={(value) => {
                const range =
                  sizeRanges.find((r) =>
                    r.value
                      ? `${r.value[0]}-${r.value[1]}` === value
                      : value === ""
                  )?.value ?? null;
                setSizeRange(range as [number, number] | null);
              }}
            >
              {sizeRanges.map((range) => (
                <DropdownMenuRadioItem
                  key={range.label}
                  value={
                    range.value ? `${range.value[0]}-${range.value[1]}` : ""
                  }
                >
                  {range.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[100px]",
                dateRange && "bg-primary/10 text-primary"
              )}
            >
              Date
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup
              value={dateRange ? dateRange.toString() : ""}
              onValueChange={(value) => {
                const range =
                  dateRanges.find((r) =>
                    r.value ? r.value.toString() === value : value === ""
                  )?.value ?? null;
                setDateRange(range as [Date, Date] | null);
              }}
            >
              {dateRanges.map((range) => (
                <DropdownMenuRadioItem
                  key={range.label}
                  value={range.value ? range.value.toString() : ""}
                >
                  {range.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {(fileType || sizeRange || dateRange) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFileType(null);
              setSizeRange(null);
              setDateRange(null);
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
