"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useApi } from "@/components/hooks";
import { User } from "@/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { put, useQuery } = useApi();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User | null> => await getCurrentUser(),
  });

  const { mutate: updateUser } = useMutation<User, Error, Partial<User>>({
    mutationFn: (user: Partial<User>) => put("/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name ?? "");
  const [newAvatar, setNewAvatar] = useState(user?.avatar ?? "");

  useEffect(() => {
    if (user) {
      setNewName(user.name ?? "");
      setNewAvatar(user.avatar ?? "");
    }
  }, [user]);

  const handleSave = () => {
    updateUser({ name: newName, avatar: newAvatar });
    setIsEditing(false);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );

  if (error) return <p>An error occurred.</p>;

  if (!user) return <p>User Details Not Found</p>;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <UserIcon className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your profile information
            </p>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
              <AvatarImage src={user.avatar ?? ""} alt={user.name ?? ""} />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                {user.name?.[0]}
              </AvatarFallback>
            </Avatar>

            {isEditing ? (
              <div className="space-y-4 w-full max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Avatar URL</label>
                  <Input
                    value={newAvatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                    placeholder="Avatar URL"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Member Since
                    </p>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="font-medium">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
