import prisma from "../../config/prisma";

export const getWorkers = async (
  filters: {
    skillCategory?: string;
    city?: string;
    isAvailable?: boolean;
    isVerified?: boolean;
  }
) => {
  return prisma.workerProfile.findMany({
    where: {
      ...(filters.skillCategory && {
        skillCategory: filters.skillCategory as any,
      }),

      ...(filters.city && {
        city: {
          equals: filters.city,
          mode: "insensitive",
        },
      }),

      ...(filters.isAvailable !== undefined && {
        isAvailable: filters.isAvailable,
      }),

      ...(filters.isVerified !== undefined && {
        isVerified: filters.isVerified,
      }),
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });
};

export const getWorkerById = async (
  workerId: string
) => {
  const worker =
    await prisma.workerProfile.findUnique({
      where: {
        id: workerId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

  if (!worker) {
    throw new Error("Worker not found");
  }

  return worker;
};