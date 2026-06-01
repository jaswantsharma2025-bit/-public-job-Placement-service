import { z } from "zod";

export const workerProfileSchema = z.object({
  aadhaarNumber: z.string().min(12).max(12),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]),

  skillCategory: z.enum([
  "MAID",
  "COOK",
  "DRIVER",
  "NURSE",
  "PLUMBER",
  "ELECTRICIAN",
]),

// isAvailable: z.boolean().optional(),

  experience: z.number().min(0),

  expectedSalary: z.number().positive(),

  city: z.string().min(2),

  state: z.string().min(2),

  latitude: z.number().optional(),

  longitude: z.number().optional(),
});

export const updateWorkerProfileSchema =
  workerProfileSchema.partial();

  export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  city: z.string().optional(),
  state: z.string().optional(),
});