"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useApi } from "@/components/hooks";
import { User } from "@/queries";
import { useMutation, useQueryClient } from "react-query";

export default function ProfilePage() {
  const { get, put, useQuery } = useApi();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => get("/users"),
  });
  // Update user mutation
  const { mutate: updateUser } = useMutation<User, Error, Partial<User>>({
    mutationFn: (user: Partial<User>) => put("/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name ?? "");
  const [newAvatar, setNewAvatar] = useState(user?.avatar ?? "");

  // Add useEffect to update state when user data is loaded
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
      </div>
    );

  if (error) return <p>An error occurred.</p>;

  if (!user) return <p>User Details Not Found</p>;

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 space-y-8 mt-2 border border-muted-gray-100">
      <div className="w-full space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user.avatar ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>

          {isEditing ? (
            <div className="space-y-4 w-full max-w-md">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                value={newAvatar}
                onChange={(e) => setNewAvatar(e.target.value)}
                placeholder="Avatar URL"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4 bg-muted/50 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
