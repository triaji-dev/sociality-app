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
import { PageLoader, ErrorState } from "@/components/shared";
import { UserAvatar } from "@/components/users";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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

  const triggerAvatarInput = () => {
    const input = document.getElementById("avatar-input") as HTMLInputElement;
    input?.click();
  };

  function onSubmit(data: EditProfileFormData) {
    updateMe.mutate(
      {
        ...data,
        avatar: avatarFile || undefined,
      },
      {
        onSuccess: () => {
          router.push("/profile");
        },
      }
    );
  }

  const handleBack = () => {
    router.back();
  };

  // Shared input styling
  const inputClassName = "w-full h-12 bg-muted/30 border border-border rounded-xl text-foreground text-base font-medium tracking-tight placeholder:text-muted-foreground focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary-300";
  const labelClassName = "text-foreground text-sm font-bold leading-7 tracking-tight";

  return (
    <div className="w-full">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex flex-row justify-between items-center px-4 h-16">
          <div className="flex flex-row items-center gap-2 flex-1">
            <button
              onClick={handleBack}
              className="w-6 h-6 flex items-center justify-center hover:bg-accent rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" strokeWidth={1.875} />
            </button>
            <h1 className="text-foreground text-base font-bold leading-[30px] tracking-tight">
              Edit Profile
            </h1>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <UserAvatar user={profile} size="md" className="w-full h-full" />
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] mx-auto pt-4 md:pt-0 px-0">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-row items-center gap-3 mb-8">
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={2.5} />
          </button>
          <h1 className="text-foreground text-2xl font-bold leading-9 tracking-tight">
            Edit Profile
          </h1>
        </div>

        {/* Form Container */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 pt-4 md:pt-0">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 w-full md:w-[160px]">
            <div className="w-20 h-20 md:w-[130px] md:h-[130px] rounded-full overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <UserAvatar user={profile} size="xl" className="w-full h-full" />
              )}
            </div>

            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <Button
              type="button"
              onClick={triggerAvatarInput}
              className="w-[160px] h-10 md:h-12 border border-border bg-transparent text-foreground text-sm md:text-base font-bold tracking-tight rounded-full hover:bg-accent hover:border-accent"
            >
              Change Photo
            </Button>
          </div>

          {/* Form Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 md:gap-6 w-full md:flex-1">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className={labelClassName}>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your name"
                        disabled={updateMe.isPending}
                        className={inputClassName}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm font-medium" />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className={labelClassName}>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your username"
                        disabled={updateMe.isPending}
                        className={inputClassName}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm font-medium" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className={labelClassName}>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+628123456789"
                        disabled={updateMe.isPending}
                        className={inputClassName}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm font-medium" />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className={labelClassName}>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us about yourself"
                        rows={3}
                        disabled={updateMe.isPending}
                        className={`${inputClassName} min-h-[101px] resize-none`}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm font-medium" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={updateMe.isPending}
                className="w-full h-10 md:h-12 bg-primary-300 text-white text-sm md:text-base font-bold tracking-tight rounded-full hover:bg-primary-300/90 transition-colors disabled:opacity-50"
              >
                {updateMe.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
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
