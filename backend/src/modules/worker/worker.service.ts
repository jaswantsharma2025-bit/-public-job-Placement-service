import prisma from "../../config/prisma";

export const createWorkerProfile = async (
  userId: string,
  data: any
) => {
  const existingProfile =
    await prisma.workerProfile.findUnique({
      where: { userId },
    });

  if (existingProfile) {
    throw new Error("Worker profile already exists");
  }

  return prisma.workerProfile.create({
    data: {
      userId,
      aadhaarNumber: data.aadhaarNumber,
      gender: data.gender,
      skillCategory: data.skillCategory,
      experience: data.experience,
      expectedSalary: data.expectedSalary,
      city: data.city,
      state: data.state,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });
};

export const getWorkerProfile = async (
  userId: string
) => {
  const profile =
    await prisma.workerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
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

  if (!existing) {
    return prisma.workerProfile.create({
      data: { userId, ...data },
    });
  }

  return prisma.workerProfile.update({
    where: { userId },
    data,
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
    data: { isAvailable },
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
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      state: data.state,
    },
  });
};

export const getWorkerEarnings = async (
  userId: string
) => {
  const bookings = await prisma.booking.findMany({
    where: {
      workerId: userId,
      status: "COMPLETED",
    },
  });

  const totalEarnings = bookings.reduce(
    (sum, booking) =>
      sum + Number(booking.servicePrice || 0),
    0
  );

  return {
    totalBookings: bookings.length,
    totalEarnings,
  };
};