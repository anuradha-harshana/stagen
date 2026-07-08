import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),

    email: z
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain one uppercase letter")
      .regex(/[0-9]/, "Must contain one number"),

    confirmPassword: z.string(),

    role: z.enum(["customer", "company"], {
      message: "Please select a valid role",
    }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type RegisterFormData = z.infer<typeof registerSchema>;