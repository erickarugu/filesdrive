"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "../ui/use-toast";
import { createUserApp, getCurrentUser } from "@/app/dashboard/actions";

interface CreateAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (appId: string) => void;
}

export function CreateAppDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateAppDialogProps) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await getCurrentUser();
      if (!user) return;

      const newApp = await createUserApp({ input: { name, userId: user.id } });

      queryClient.invalidateQueries({ queryKey: ["userApps"] });
      toast({
        title: "App created",
        description: "Your app has been created successfully.",
      });
      onSuccess?.(newApp.id);
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create app. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New App</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">App Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter app name..."
            />
          </div>
          <Button type="submit" className="w-full">
            Create App
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
