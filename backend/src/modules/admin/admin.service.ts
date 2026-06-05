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

export const forceCompleteBooking =
  async (bookingId: string) => {
    return prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
};

export const forceCancelBooking =
  async (bookingId: string) => {
    return prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });
};

export const reassignBooking =
  async (
    bookingId: string,
    newWorkerId: string
  ) => {

    const worker =
      await prisma.workerProfile.findUnique({
        where: {
          userId: newWorkerId,
        },
        include: {
          user: true,
        },
      });

    if (!worker) {
      throw new Error(
        "Worker not found"
      );
    }

    if (!worker.isVerified) {
      throw new Error(
        "Worker not verified"
      );
    }

    if (worker.isSuspended) {
      throw new Error(
        "Worker suspended"
      );
    }

    if (!worker.isAvailable) {
      throw new Error(
        "Worker unavailable"
      );
    }

    return prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        workerId: newWorkerId,
        workerName: worker.user.name,
        workerPhone: worker.user.phone,

        status: "PENDING",

        acceptedAt: null,
      },
    });
};

export const getReplacementCandidates =
  async (bookingId: string) => {

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

    if (!booking) {
      throw new Error(
        "Booking not found"
      );
    }

    return prisma.workerProfile.findMany({
      where: {
        skillCategory:
          booking.serviceCategory,

        city: booking.city,

        isVerified: true,

        isAvailable: true,

        isSuspended: false,

        userId: {
          not: booking.workerId,
        },
      },

      include: {
        user: true,
      },
    });
};