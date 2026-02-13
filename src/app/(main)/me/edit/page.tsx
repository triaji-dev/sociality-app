"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateMe, useMe } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner, PageLoader, ErrorState } from "@/components/shared";
import { UserAvatar } from "@/components/users";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth";

const editProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  phone: z
    .string()
    .regex(/^08[0-9]{8,11}$/, "Please enter a valid Indonesian phone number"),
  bio: z.string().max(150, "Bio must be at most 150 characters").optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

function EditProfileContent() {
  const router = useRouter();
  const updateMe = useUpdateMe();
  const { data, isLoading, error, refetch } = useMe();
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      username: "",
      phone: "",
      bio: "",
    },
  });

  // Pre-fill form when data is loaded
  useEffect(() => {
    if (data?.data) {
      const profile = data.data.profile;
      form.reset({
        name: profile.name,
        username: profile.username,
        phone: profile.phone,
        bio: profile.bio || "",
      });
    }
  }, [data, form]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !data?.data) {
    return <ErrorState message={error?.message || "Failed to load profile"} onRetry={() => refetch()} />;
  }

  const profile = data.data.profile;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: EditProfileFormData) {
    updateMe.mutate(
      {
        ...data,
        avatar: avatarFile || undefined,
      },
      {
        onSuccess: () => {
          router.push("/me");
        },
      }
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/me" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6 p-4 border rounded-lg bg-card">
            <UserAvatar
              src={avatarPreview || profile.avatarUrl}
              name={profile.name}
              size="xl"
            />
            <div>
              <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                Change Photo
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: Square JPG, PNG. Max 1MB.
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={updateMe.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} disabled={updateMe.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} disabled={updateMe.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    rows={4}
                    disabled={updateMe.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/me")}
              disabled={updateMe.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={updateMe.isPending}>
              {updateMe.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <EditProfileContent />
    </AuthGuard>
  );
}
