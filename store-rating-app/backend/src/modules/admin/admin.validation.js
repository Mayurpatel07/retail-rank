import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

export const createUserSchema = z.object({
  name: z.string().trim().min(20).max(60),
  email: z.string().trim().email(),
  address: z.string().trim().max(400),
  password: passwordSchema,
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]),
});

export const createStoreSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  address: z.string().trim().max(400),
  ownerId: z.number().int().positive(),
}); 