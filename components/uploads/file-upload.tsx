"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios, { AxiosProgressEvent } from "axios";
import { useTheme } from "next-themes";
import { CloudUpload } from "lucide-react";
import {
  createNewUpload,
  getCurrentUser,
  getGCPSignedUrl,
} from "@/app/dashboard/actions";
import { formatBytes, getTimeDifference } from "@/lib/utils";

export default function FileUpload() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number>();
  const [progressEvent, setProgressEvent] = useState<AxiosProgressEvent>();
  const queryClient = useQueryClient();
  const { theme } = useTheme();

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
        setProgressEvent(progressEvent);
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

    const signedUrlResponse = await getGCPSignedUrl();

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
    <div className="flex-col flex-1 self-stretch">
      <div className="flex justify-end items-center gap-2 my-7">
        <div className="flex items-center gap-1 focus:outline-none">
          <Input
            id="picture"
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploadFileMutation.isPending}
          />
          <Label
            htmlFor="picture"
            className="cursor-pointer flex items-center gap-2 bg-primary text-secondary p-3 py-2 rounded shadow-sm"
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${progress}%`,
                height: "100%",
                backgroundColor: theme === "dark" ? "#4a5568" : "#a0aec0",
                transition: "width 0.2s",
                zIndex: 0,
                opacity: 0.4,
              }}
            ></div>

            {!uploadFileMutation.isPending && !startTime && (
              <>
                <CloudUpload />
                <span>Upload</span>
              </>
            )}

            {uploadFileMutation.isPending && startTime && (
              <>
                <span className="text-sm text-muted">
                  Uploading... ({progress.toFixed(2) + "%"})
                </span>
              </>
            )}
          </Label>
        </div>
      </div>
      {startTime && (
        <div className="flex flex-row gap-5 justify-end text-muted-foreground text-sm">
          <p>File: {file?.name}</p>
          <p>
            Time taken: {getTimeDifference(new Date(startTime), new Date())}
          </p>
          {progressEvent?.loaded && progressEvent?.total && (
            <p>
              File size:
              {formatBytes(progressEvent?.loaded)} /{" "}
              {formatBytes(progressEvent?.total)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
