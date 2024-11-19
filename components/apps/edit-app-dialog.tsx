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
import { App } from "@/queries/app";
import { updateUserApp } from "@/app/dashboard/actions";

interface EditAppDialogProps {
  app: App;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAppDialog({ app, open, onOpenChange }: EditAppDialogProps) {
  const [name, setName] = useState(app.name);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name === app.name) {
      onOpenChange(false);
      return;
    }

    try {
      await updateUserApp({
        where: { id: app.id },
        input: { name },
      });

      queryClient.invalidateQueries({ queryKey: ["userApps"] });
      toast({
        title: "App updated",
        description: "Your app has been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update app. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit App</DialogTitle>
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
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={name === app.name}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
