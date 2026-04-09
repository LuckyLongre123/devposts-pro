"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, ShieldCheck, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/utils/zod/schemas";
import { ProfileType } from "@/types";

export default function ProfilePage() {
  const { user, logout, isLoading, setUser } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }
  const nameValue = watch("name");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/signin");
  };
  
  const onSubmit = async (data: ProfileType) => {
    if (!user?.id) return;

    const updatePromise = fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update name");
      }
      const updatedUser = await res.json();

      // Update user in auth store if you have an update method
      console.log("Updated user:", updatedUser);
      setUser(updatedUser.data.user);

      setIsEditing(false);
      return updatedUser;
    });

    // Fire the toast
    toast.promise(updatePromise, {
      loading: "Updating name...",
      success: "Name updated successfully!",
      error: (err) => err.message || "Failed to update name",
    });

    await updatePromise;
  };

  const handleCancel = () => {
    setValue("name", user?.name || "");
    setIsEditing(false);
  };

  return (
    <main className="bg-background min-h-screen min-h-screen py-12 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-12 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          {/* Avatar */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-4xl font-bold text-white shadow-xl shadow-blue-500/20 md:h-28 md:w-28">
            {(nameValue || user?.name)?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Account Settings
            </h1>
            <p className="mt-1 text-foreground/60">
              Manage your profile and application preferences.
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Personal Information Card */}
        <section className=":rounded-3xl border border-foreground/10 bg-foreground/5 p-6 mdp-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-blue-500" />
            Personal Information
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/50">
                Full Name
              </label>
              <div className="rounded-xl border border-foreground/10 bg-background px-4 py-3">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full bg-transparent outline-none focus:ring-0 text-foreground"
                      autoFocus
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {user?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-sm font-semibold text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Email Field - Read Only */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/50">
                Email Address
              </label>
              <div className="flex items-center justify-between rounded-xl border border-foreground/10 bg-background px-4 py-3">
                <span className="font-medium text-foreground">
                  {user?.email}
                </span>
                <ShieldCheck className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-xs text-foreground/40 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Action Buttons - Show only in edit mode */}
            {isEditing && (
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-500 cursor-pointer px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl cursor-pointer border border-foreground/10 bg-foreground/5 px-6 py-2.5 text-sm font-medium text-foreground/60 transition-all hover:bg-foreground/10"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
