import prisma from "../../config/prisma";

const workerInclude = {
  user: {
    select: { id: true, name: true, phone: true },
  },
  skills: {
    include: {
      subCategory: {
        include: { category: true },
      },
    },
  },
} as const;

export const getWorkers = async (filters: {
  subCategoryIds?: string[];  // filter by one or more sub-category IDs
  city?: string;
  isAvailable?: boolean;
  isVerified?: boolean;
}) => {
  return prisma.workerProfile.findMany({
    where: {
      // If subCategoryIds provided, worker must have at least one matching skill
      ...(filters.subCategoryIds && filters.subCategoryIds.length > 0 && {
        skills: {
          some: {
            subCategoryId: { in: filters.subCategoryIds },
          },
        },
      }),

      ...(filters.city && {
        city: { equals: filters.city, mode: "insensitive" },
      }),

      ...(filters.isAvailable !== undefined && {
        isAvailable: filters.isAvailable,
      }),

      ...(filters.isVerified !== undefined && {
        isVerified: filters.isVerified,
      }),
    },
    include: workerInclude,
  });
};

export const getWorkerById = async (workerId: string) => {
  const worker = await prisma.workerProfile.findUnique({
    where: { id: workerId },
    include: workerInclude,
  });

  if (!worker) throw new Error("Worker not found");
  return worker;
};