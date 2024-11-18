"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import FileUpload from "./file-upload";
import { File } from "lucide-react";

interface UploadsHeadProps {
  setSearchText: (text: string) => void;
  searchText: string;
}

export function UploadsHead({ setSearchText, searchText }: UploadsHeadProps) {
  return (
    <div className="flex flex-row gap-4 mb-3 justify-between items-end">
      <div className="flex-col items-center gap-2 flex-1">
        <div className="flex items-center gap-2 mb-6">
          <File />
          <h5 className="text-xl font-semibold">Files</h5>
        </div>
        <p className="leading-none text-muted-foreground my-2">
          Here you can see all the files you have uploaded
        </p>
        <div className="flex items-center gap-2 my-4">
          <Input
            type="text"
            placeholder="Search files"
            className="w-full focus:outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            variant="outline"
            className="flex items-center gap-1 focus:outline-none"
          >
            {/* TODO: Add plus icon */}
            <Icons.add className="h-5 w-5 border border-gray-500 p-1 rounded-full" />
            <span>Status</span>
          </Button>
        </div>
      </div>
      <FileUpload />
    </div>
  );
}
