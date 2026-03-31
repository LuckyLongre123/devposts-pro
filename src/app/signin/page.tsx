"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signInSchema } from "@/utils/zod/schemas";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });
  const router = useRouter();

  async function onSubmit(data: any) {
    const toastId = toast.loading("Verifying credentials...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Invalid email or password");
      }

      // 1. Update Zustand store (if you have one)
      // useAuthStore.getState().setUser(result.user);

      toast.success("Welcome back! 🎉", { id: toastId });

      // 2. Redirect to dashboard/posts
      router.push("/posts");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ❌", { id: toastId });
    }
  }

  return (
    <div className="flex py-10 items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-foreground/10 p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Log in to manage your posts
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              {...register("email")}
              required
              className={`mt-1 w-full rounded-lg border border-foreground/10 bg-transparent p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              {...register("password")}
              type="password"
              required
              className={`mt-1 w-full rounded-lg border border-foreground/10 bg-transparent p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-foreground/60">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-blue-500 hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
