"use client";

import { useState } from "react";
import { contactSchema } from "@/utils/zod/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ContactType } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

export default function ContactPage() {
  const user = useAuthStore((st) => st.user);

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  async function onSubmit(data: ContactType) {
    const toastId = toast.loading("Sending your message...");

    try {
      console.log("Form Data:", data);
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ ...data, email: data.email.toLowerCase() }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();

      if (!res.ok || !resData.success)
        return toast.error(resData.message || "failed to send message");

      toast.success(resData?.message || "User register successfully 🎉", {
        id: toastId,
      });

      setIsSuccess(true);
      reset();
    } catch (error: any) {
      console.log(error);

      toast.error("Something went wrong ❌", { id: toastId });
    }
  }

  if (isSuccess) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-6 py-10 text-center">
        <h1 className="mt-6 text-3xl font-bold">Message Received!</h1>
        <p className="mt-4 text-foreground/60">
          Thanks for reaching out. I've received your message and will get back
          to you as soon as possible.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-blue-500 hover:underline font-medium"
        >
          Send another message
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Get in touch
      </h1>
      <p className="mt-4 text-foreground/60">
        Have a question or just want to connect? Send me an email and I'll get
        back to you soon.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-6">
        {/* ... (Your existing input fields) ... */}

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            {...register("name")}
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
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className={`mt-1 w-full rounded-lg border border-foreground/10 bg-transparent p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            rows={4}
            {...register("message")}
            className={`mt-1 w-full rounded-lg border border-foreground/10 bg-transparent p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
            }`}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">
              {errors.message.message}
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
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
