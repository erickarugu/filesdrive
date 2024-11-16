"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios, { AxiosProgressEvent } from "axios";
import { useTheme } from "next-themes";
import { CloudUpload } from "lucide-react";

export default function FileUpload() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number>();
  const [progressEvent, setProgressEvent] = useState<AxiosProgressEvent>();

  const { theme } = useTheme();

  const fetchSignedUrl = async (data: FormData) => {
    const response = await fetch(`/api/uploads`, {
      method: "POST",
      body: data,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch signed URL");
    }
    return response.json();
  };

  const uploadFile = async ({
    signedUrl,
    file,
  }: {
    signedUrl: string;
    file: File;
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

  const { mutate: generateSignedUrl, isLoading: isGeneratingSignedUrl } =
    useMutation(fetchSignedUrl, {
      onSuccess: (data: { signedUrl: string }) => {
        const { signedUrl: url } = data;

        console.log({ data, file });

        if (!url) return;

        if (!file) return;

        uploadFileMutation.mutate({ signedUrl: url, file });
      },

      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: "An error occurred while generating the signed URL",
        });
        setStartTime(undefined);
      },
    });

  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: (data) => {
      if (!startTime) return;
      toast({
        title: "File uploaded successfully!",
        description: `The file upload took ${
          (new Date().getTime() - startTime) / 1000
        } s to complete`,
        action: <ToastAction altText="Close toast">Close</ToastAction>,
      });

      setProgress(0);
      setStartTime(undefined);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "An error occurred while uploading the file",
      });
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

    const formData = new FormData();
    formData.append("file", tempFile);
    formData.append("filename", tempFile.name);

    generateSignedUrl(formData);
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
            disabled={isGeneratingSignedUrl || uploadFileMutation.isLoading}
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

            {!(isGeneratingSignedUrl || uploadFileMutation.isLoading) && (
              <>
                <CloudUpload />
                <span>Upload</span>
              </>
            )}

            {(isGeneratingSignedUrl || uploadFileMutation.isLoading) && (
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
            Time taken: {((new Date().getTime() - startTime) / 1000).toFixed(2)}{" "}
            s{" "}
          </p>
          {progressEvent?.loaded && progressEvent?.total && (
            <p>
              File size: {(progressEvent?.loaded / (1024 * 1024)).toFixed(2)} MB
              / {(progressEvent.total / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
        </div>
      )}
    </div>
  );
}
