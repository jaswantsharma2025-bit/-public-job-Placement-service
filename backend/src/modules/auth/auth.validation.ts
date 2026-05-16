import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  password: z.string().min(6),
  role: z.enum(["CUSTOMER", "WORKER", "EMPLOYER"]),
});

export const loginSchema = z.object({
  phone: z.string(),
  password: z.string(),
});