"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Input } from "../ui/input";
import axios from "axios";
import { CloudUpload } from "lucide-react";
import {
  createNewUpload,
  getCurrentUser,
  getGCPSignedUrl,
} from "@/app/dashboard/actions";
import { getTimeDifference } from "@/lib/utils";
import { Button } from "../ui/button";
import { FloatingUploadButton } from "./floating-upload-button";
import { UploadOverlay } from "./upload-overlay";

export default function FileUpload({ appId }: { appId: string }) {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number>();
  const queryClient = useQueryClient();

  const uploadFile = async ({
    signedUrl,
    file,
  }: {
    signedUrl: string;
    file: File;
    fileKey: string;
  }) => {
    return axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percentComplete =
          (progressEvent.loaded / progressEvent?.total) * 100;
        setProgress(percentComplete);
      },
    });
  };

  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: async (_, { fileKey }) => {
      const currentUser = await getCurrentUser();

      if (file && fileKey && currentUser?.id) {
        await createNewUpload({
          input: {
            key: fileKey,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
            userId: currentUser.id,
            appId,
          },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["userUploads"] });

      if (!startTime) return;

      toast({
        title: "File uploaded successfully!",
        description: `The file upload took ${getTimeDifference(
          new Date(startTime),
          new Date()
        )} to complete`,
        action: <ToastAction altText="Close toast">Close</ToastAction>,
      });

      setProgress(0);
      setStartTime(undefined);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "An error occurred while uploading the file",
      });
      setProgress(0);
      setStartTime(undefined);
    },
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const tempFile = event.target.files[0];

    await setFile(tempFile);

    if (!tempFile) {
      toast({
        variant: "destructive",
        title: "Please select a file first",
        description: "Please select a file first",
      });
      return;
    }

    setStartTime(Date.now());

    const signedUrlResponse = await getGCPSignedUrl(tempFile.name);

    if (!signedUrlResponse) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "An error occurred while getting GCP signed url",
      });
      return;
    }

    uploadFileMutation.mutate({
      signedUrl: signedUrlResponse.url,
      file: tempFile,
      fileKey: signedUrlResponse.key,
    });
  };

  const handleFileDrop = async (files: FileList) => {
    if (!files.length) return;

    const tempFile = files[0];
    await setFile(tempFile);

    if (!tempFile) {
      toast({
        variant: "destructive",
        title: "Please select a file first",
        description: "Please select a file first",
      });
      return;
    }

    setStartTime(Date.now());

    const signedUrlResponse = await getGCPSignedUrl(tempFile.name);

    if (!signedUrlResponse) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "An error occurred while getting GCP signed url",
      });
      return;
    }

    uploadFileMutation.mutate({
      signedUrl: signedUrlResponse.url,
      file: tempFile,
      fileKey: signedUrlResponse.key,
    });
  };

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        <Input
          id="fileUpload"
          type="file"
          className="hidden"
          onChange={handleUpload}
          disabled={uploadFileMutation.isPending}
        />
        <Button
          asChild
          variant="default"
          className="min-w-[140px] relative overflow-hidden"
          disabled={uploadFileMutation.isPending}
        >
          <label htmlFor="fileUpload" className="cursor-pointer">
            <div className="relative z-10 flex items-center gap-2">
              <CloudUpload className="h-4 w-4" />
              <span>
                {uploadFileMutation.isPending
                  ? `${progress.toFixed(0)}%`
                  : "Upload File"}
              </span>
            </div>
            {uploadFileMutation.isPending && (
              <div
                className="absolute inset-0 bg-primary/30"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.2s ease-in-out",
                }}
              />
            )}
          </label>
        </Button>
      </div>

      <FloatingUploadButton
        progress={progress}
        isUploading={uploadFileMutation.isPending}
        onUpload={handleUpload}
      />

      <UploadOverlay
        onUpload={handleFileDrop}
        isUploading={uploadFileMutation.isPending}
      />
    </>
  );
}
