import { z } from "zod";

export const customerProfileSchema = z.object({
  gender: z.enum([
    "MALE",
    "FEMALE",
    "OTHER",
  ]),

  address: z.string().min(5),

  city: z.string().min(2),

  state: z.string().min(2),

  latitude: z.number().optional(),

  longitude: z.number().optional(),
});

export const updateCustomerProfileSchema =
  customerProfileSchema.partial();