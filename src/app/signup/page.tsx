"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/utils/zod/schemas";
import { SignUpType } from "@/types";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });
  const router = useRouter();

  async function onSubmit(data: SignUpType) {
    const toastId = toast.loading("Creating your account...");

    try {
      console.log("Form Data:", data);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ ...data, email: data.email.toLowerCase() }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();

      if (!res.ok || !resData.success) {
        reset();
        return toast.error(resData.message || "failed to register user!");
      }

      toast.success("Account created! Please sign in. 🎉", { id: toastId });
      router.push("/signin");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ❌", { id: toastId });
    }
  }
  return (
    <div className="flex py-2 min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-foreground/10 p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Join our community today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              {...register("name")}
              type="text"
              required
              className={`mt-1 w-full rounded-lg border border-foreground/10 bg-transparent p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
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
          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              required
              className={`mt-1 w-full rounded-lg border border-foreground/10 bg-transparent p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
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
            {isSubmitting ? "Creating..." : "Create Account"}
            {/* {isSubmitting ? "Logging in..." : "Login"} */}
          </button>
        </form>

        <p className="text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-bold text-blue-500 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
