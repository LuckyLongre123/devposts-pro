import z from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "name is required"
            : "name must be a string",
      })
      .min(3, "name must be at least 3 characters"),

    email: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "email is required"
            : "email must be a string",
      })
      .email("Please use a valid email address"),

    password: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "password is required"
            : "password must be a string",
      })
      .min(8, "password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
        "Password must be 8+ chars with uppercase, lowercase, number, and special character",
      ),

    confirmPassword: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "confirm password is required"
            : "confirm password must be a string",
      })
      .min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "email is required"
          : "email must be a string",
    })
    .email("Please use a valid email address"),

  password: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "password is required"
          : "password must be a string",
    })
    .min(6, "password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "name is required" : "name must be a string",
    })
    .min(3, "name must be at least 3 characters"),

  email: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "email is required"
          : "email must be a string",
    })
    .email("Please use a valid email address"),

  message: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "message is required"
          : "message must be a string",
    })
    .min(10, "message must be at least 10 characters")
    .max(500, "message can't be more than 500 characters"),
});
