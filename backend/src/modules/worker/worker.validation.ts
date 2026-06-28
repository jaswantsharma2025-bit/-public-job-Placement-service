import { z } from "zod";

// ── Shared enums ─────────────────────────────────────────────────────────────

const skillCategoryEnum = z.enum([
  "MAID",
  "COOK",
  "DRIVER",
  "NURSE",
  "PLUMBER",
  "ELECTRICIAN",
]);

const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

const maritalStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
]);

const educationLevelEnum = z.enum([
  "NO_FORMAL_EDUCATION",
  "PRIMARY",
  "SECONDARY",
  "HIGHER_SECONDARY",
  "DIPLOMA",
  "GRADUATE",
  "POST_GRADUATE",
]);

// ── Full create schema ────────────────────────────────────────────────────────

export const workerProfileSchema = z.object({
  // Documents
  aadhaarNumber:  z.string().length(12, "Aadhaar must be exactly 12 digits"),
  profilePhotoUrl: z.string().url().optional(),

  // Personal
  gender:        genderEnum.optional(),
  dateOfBirth:   z.string().optional(),   // ISO date string; service converts to Date
  height:        z.number().positive().optional(),
  weight:        z.number().positive().optional(),
  languagesKnown: z.array(z.string()).optional(),
  education:     educationLevelEnum.optional(),
  maritalStatus: maritalStatusEnum.optional(),

  // Professional
  skillCategory:           skillCategoryEnum,
  experience:              z.number().min(0),
  expectedSalary:          z.number().positive(),
  aboutYourself:           z.string().max(1000).optional(),
  previousCompanies:       z.string().optional(),
  certifications:          z.string().optional(),
  availableTimings:        z.string().optional(),
  preferredWorkingRadius:  z.number().int().positive().optional(),
  canRelocate:             z.boolean().optional(),

  // Family & Emergency
  fatherName:             z.string().optional(),
  motherName:             z.string().optional(),
  emergencyContact:       z.string().optional(),
  emergencyContactNumber: z.string().optional(),

  // Location
  city:      z.string().min(2).optional(),
  state:     z.string().min(2).optional(),
  latitude:  z.number().optional(),
  longitude: z.number().optional(),
});

// ── Partial update schema ─────────────────────────────────────────────────────

export const updateWorkerProfileSchema = workerProfileSchema.partial();

// ── Availability ──────────────────────────────────────────────────────────────

export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
});

// ── Location ──────────────────────────────────────────────────────────────────

export const locationSchema = z.object({
  latitude:  z.number(),
  longitude: z.number(),
  city:      z.string().optional(),
  state:     z.string().optional(),
});