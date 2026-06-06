import { z } from "zod";

export const createBookingSchema = z.object({
  workerId: z.string(),

  bookingType: z.enum([
    "INSTANT",
    "SCHEDULED",
  ]),

  serviceCategory: z.enum([
    "MAID",
    "COOK",
    "DRIVER",
    "NURSE",
    "PLUMBER",
    "ELECTRICIAN",
  ]),

  address: z.string().min(5),

  city: z.string().min(2),

  scheduledDate: z.string(),

  durationMinutes: z.number().min(60),

  servicePrice: z.number().positive(),

  notes: z.string().optional(),
});