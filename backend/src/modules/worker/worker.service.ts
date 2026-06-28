import prisma from "../../config/prisma";

// ── Helper: map raw input to Prisma-safe UPDATE data object ──────────────────
// Used for updates only — never for create (which has required fields).

function mapProfileData(data: any) {
  return {
    // Documents
    ...(data.profilePhotoUrl !== undefined && { profilePhotoUrl: data.profilePhotoUrl }),

    // Personal
    ...(data.gender         !== undefined && { gender:         data.gender }),
    ...(data.dateOfBirth    !== undefined && { dateOfBirth:    data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
    ...(data.height         !== undefined && { height:         data.height }),
    ...(data.weight         !== undefined && { weight:         data.weight }),
    ...(data.languagesKnown !== undefined && { languagesKnown: data.languagesKnown }),
    ...(data.education      !== undefined && { education:      data.education }),
    ...(data.maritalStatus  !== undefined && { maritalStatus:  data.maritalStatus }),

    // Professional
    ...(data.skillCategory          !== undefined && { skillCategory:          data.skillCategory }),
    ...(data.experience             !== undefined && { experience:             data.experience }),
    ...(data.expectedSalary         !== undefined && { expectedSalary:         data.expectedSalary }),
    ...(data.aboutYourself          !== undefined && { aboutYourself:          data.aboutYourself }),
    ...(data.previousCompanies      !== undefined && { previousCompanies:      data.previousCompanies }),
    ...(data.certifications         !== undefined && { certifications:         data.certifications }),
    ...(data.availableTimings       !== undefined && { availableTimings:       data.availableTimings }),
    ...(data.preferredWorkingRadius !== undefined && { preferredWorkingRadius: data.preferredWorkingRadius }),
    ...(data.canRelocate            !== undefined && { canRelocate:            data.canRelocate }),

    // Family & Emergency
    ...(data.fatherName             !== undefined && { fatherName:             data.fatherName }),
    ...(data.motherName             !== undefined && { motherName:             data.motherName }),
    ...(data.emergencyContact       !== undefined && { emergencyContact:       data.emergencyContact }),
    ...(data.emergencyContactNumber !== undefined && { emergencyContactNumber: data.emergencyContactNumber }),

    // Location
    ...(data.city      !== undefined && { city:      data.city }),
    ...(data.state     !== undefined && { state:     data.state }),
    ...(data.latitude  !== undefined && { latitude:  data.latitude }),
    ...(data.longitude !== undefined && { longitude: data.longitude }),
  };
}

// ── Service functions ─────────────────────────────────────────────────────────

export const createWorkerProfile = async (
  userId: string,
  data: any
) => {
  const existingProfile = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new Error("Worker profile already exists");
  }

  // aadhaarNumber is required by the schema — validate before reaching Prisma
  if (!data.aadhaarNumber) {
    throw new Error("Aadhaar number is required");
  }

  if (!data.skillCategory) {
    throw new Error("Skill category is required");
  }

  return prisma.workerProfile.create({
    data: {
      userId,
      // Required fields passed explicitly so Prisma's type checker is satisfied
      aadhaarNumber: data.aadhaarNumber as string,
      skillCategory: data.skillCategory,
      experience:    data.experience ?? 0,
      expectedSalary: data.expectedSalary ?? 0,
      // All optional fields via helper
      ...mapProfileData(data),
    },
  });
};

export const getWorkerProfile = async (userId: string) => {
  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id:    true,
          name:  true,
          phone: true,
          role:  true,
        },
      },
    },
  });

  if (!profile) {
    throw new Error("Worker profile not found");
  }

  return profile;
};

export const updateWorkerProfile = async (
  userId: string,
  data: any
) => {
  const existing = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  // If no profile yet, delegate to create (which enforces required fields)
  if (!existing) {
    return createWorkerProfile(userId, data);
  }

  // For updates, only send fields that are actually present in the payload.
  // aadhaarNumber is handled separately so it can be updated without being
  // accidentally omitted (the schema requires it but we only update if provided).
  const updateData: any = {
    ...mapProfileData(data),
    ...(data.aadhaarNumber !== undefined && { aadhaarNumber: data.aadhaarNumber }),
    ...(data.skillCategory !== undefined && { skillCategory: data.skillCategory }),
    ...(data.experience    !== undefined && { experience:    data.experience }),
    ...(data.expectedSalary !== undefined && { expectedSalary: data.expectedSalary }),
  };

  return prisma.workerProfile.update({
    where: { userId },
    data:  updateData,
  });
};

export const updateAvailability = async (
  userId: string,
  isAvailable: boolean
) => {
  const existing = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new Error(
      "Worker profile not found. Please complete your profile before updating availability."
    );
  }

  return prisma.workerProfile.update({
    where: { userId },
    data:  { isAvailable },
  });
};

export const updateLocation = async (
  userId: string,
  data: any
) => {
  const existing = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new Error(
      "Worker profile not found. Please complete your profile before updating location."
    );
  }

  return prisma.workerProfile.update({
    where: { userId },
    data: {
      latitude:  data.latitude,
      longitude: data.longitude,
      city:      data.city,
      state:     data.state,
    },
  });
};

export const getWorkerEarnings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      workerId: userId,
      status:   "COMPLETED",
    },
  });

  const totalEarnings = bookings.reduce(
    (sum, booking) => sum + Number(booking.servicePrice || 0),
    0
  );

  return {
    totalBookings: bookings.length,
    totalEarnings,
  };
};