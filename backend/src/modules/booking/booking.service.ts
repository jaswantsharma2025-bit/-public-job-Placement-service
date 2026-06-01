import prisma from "../../config/prisma";

export const createBooking = async (
  customerId: string,
  data: any
) => {
  const customer =
    await prisma.user.findUnique({
      where: { id: customerId },
    });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const worker =
    await prisma.user.findUnique({
      where: { id: data.workerId },
    });

  if (!worker) {
    throw new Error("Worker not found");
  }

  return prisma.booking.create({
    data: {
      customerId,
      workerId: data.workerId,

      customerName: customer.name,
      customerPhone: customer.phone,

      workerName: worker.name,
      workerPhone: worker.phone,

      bookingType: data.bookingType,

      serviceCategory:
        data.serviceCategory,

      address: data.address,

      city: data.city,

      scheduledDate: new Date(
        data.scheduledDate
      ),

      durationMinutes:
        data.durationMinutes,

      servicePrice:
        data.servicePrice,

      notes: data.notes,
    },
  });
};

export const getCustomerBookings =
  async (customerId: string) => {
    return prisma.booking.findMany({
      where: {
        customerId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const getWorkerBookings =
  async (workerId: string) => {
    return prisma.booking.findMany({
      where: {
        workerId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const getBookingById =
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

    return booking;
  };

export const acceptBooking =
  async (
    bookingId: string,
    workerId: string
  ) => {
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

    if (
      booking.workerId !== workerId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    if (
      booking.status !== "PENDING"
    ) {
      throw new Error(
        "Booking already processed"
      );
    }

    return prisma.booking.update({
      where: {
        id: bookingId,
      },

      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
    });
  };

export const rejectBooking =
  async (
    bookingId: string,
    workerId: string
  ) => {
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

    if (
      booking.workerId !== workerId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    if (
      booking.status !== "PENDING"
    ) {
      throw new Error(
        "Booking already processed"
      );
    }

    return prisma.booking.update({
      where: {
        id: bookingId,
      },

      data: {
        status: "REJECTED",
      },
    });
  };

  export const startBooking = async (
  bookingId: string,
  workerId: string
) => {
  const booking =
    await prisma.booking.findUnique({
      where: { id: bookingId },
    });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.workerId !== workerId) {
    throw new Error("Unauthorized");
  }

  if (booking.status !== "ACCEPTED") {
    throw new Error(
      "Booking must be ACCEPTED first"
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });
};

export const completeBooking = async (
  bookingId: string,
  workerId: string
) => {
  const booking =
    await prisma.booking.findUnique({
      where: { id: bookingId },
    });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.workerId !== workerId) {
    throw new Error("Unauthorized");
  }

  if (
    booking.status !== "IN_PROGRESS"
  ) {
    throw new Error(
      "Booking must be IN_PROGRESS"
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });
};

export const cancelBooking = async (
  bookingId: string,
  customerId: string
) => {
  const booking =
    await prisma.booking.findUnique({
      where: { id: bookingId },
    });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (
    booking.customerId !== customerId
  ) {
    throw new Error("Unauthorized");
  }

  if (
    booking.status === "COMPLETED"
  ) {
    throw new Error(
      "Completed booking cannot be cancelled"
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });
};