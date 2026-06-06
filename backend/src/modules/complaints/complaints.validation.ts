import { z } from "zod";

export const createComplaintSchema =
  z.object({
    bookingId: z.string(),

    againstUserId: z.string(),

    reason: z.string().min(3),

    description: z.string().optional(),
  });