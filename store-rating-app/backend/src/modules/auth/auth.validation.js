import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

export const signupSchema = z.object({
  name: z.string().trim().min(20).max(60),
  email: z.string().trim().email(),
  address: z.string().trim().max(400),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});