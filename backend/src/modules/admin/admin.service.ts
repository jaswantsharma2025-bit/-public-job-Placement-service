import prisma from "../../config/prisma";

export const getPendingWorkers = async () => {
  return prisma.workerProfile.findMany({
    where: {
      isVerified: false,
      rejectionReason: null,
    },
    include: {
      user: true,
    },
  });
};

export const approveWorker = async (
  userId: string,
  adminId: string
) => {
  return prisma.workerProfile.update({
    where: {
      userId,
    },
    data: {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: adminId,
      rejectionReason: null,
    },
  });
};

export const rejectWorker = async (
  userId: string,
  reason: string
) => {
  return prisma.workerProfile.update({
    where: {
      userId,
    },
    data: {
      isVerified: false,
      rejectionReason: reason,
    },
  });
};

export const suspendWorker = async (
  userId: string,
  reason: string
) => {
  return prisma.workerProfile.update({
    where: {
      userId,
    },
    data: {
      isSuspended: true,
      suspensionReason: reason,
    },
  });
};

export const reactivateWorker = async (
  userId: string
) => {
  return prisma.workerProfile.update({
    where: {
      userId,
    },
    data: {
      isSuspended: false,
      suspensionReason: null,
    },
  });
};

export const getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAnalytics = async () => {
  const totalCustomers =
    await prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    });

  const totalWorkers =
    await prisma.user.count({
      where: {
        role: "WORKER",
      },
    });

  const verifiedWorkers =
    await prisma.workerProfile.count({
      where: {
        isVerified: true,
      },
    });

  const totalBookings =
    await prisma.booking.count();

  const completedBookings =
    await prisma.booking.count({
      where: {
        status: "COMPLETED",
      },
    });

  const revenueData =
    await prisma.booking.aggregate({
      _sum: {
        platformFee: true,
      },
    });

  return {
    totalCustomers,
    totalWorkers,
    verifiedWorkers,
    totalBookings,
    completedBookings,
    totalRevenue:
      revenueData._sum.platformFee || 0,
  };
};