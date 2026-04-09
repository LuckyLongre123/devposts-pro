import { ZodSchema } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function validate<T>(
  schema: ZodSchema<T>,
  body: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues?.[0]?.message || "Validation error";
    return { success: false, error: message };
  }

  return { success: true, data: result.data };
}
