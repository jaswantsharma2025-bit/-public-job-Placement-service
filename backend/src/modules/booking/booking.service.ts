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
  await prisma.workerProfile.findUnique({
    where: {
      userId: data.workerId,
    },
    include: {
      user: true,
    },
  });

if (!worker) {
  throw new Error("Worker not found");
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

if (
  worker.skillCategory !==
  data.serviceCategory
) {
  throw new Error(
    "Worker does not provide this service"
  );
}

  return prisma.booking.create({
    data: {
      customerId,
      workerId: data.workerId,

      customerName: customer.name,
      customerPhone: customer.phone,

      workerName: worker.user.name,
workerPhone: worker.user.phone,

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

export const getCustomerBookings = async (customerId: string) => {
  return prisma.booking.findMany({
    where: { customerId },
    include: {
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getWorkerBookings = async (workerId: string) => {
  return prisma.booking.findMany({
    where: { workerId },
    include: {
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
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

    const workerProfile =
  await prisma.workerProfile.findUnique({
    where: {
      userId: workerId,
    },
  });

if (!workerProfile?.isAvailable) {
  throw new Error(
    "Worker unavailable"
  );
}

if (!workerProfile.isVerified) {
  throw new Error(
    "Worker not verified"
  );
}

if (workerProfile.isSuspended) {
  throw new Error(
    "Worker suspended"
  );
}

const activeBooking =
  await prisma.booking.findFirst({
    where: {
      workerId,

      status: {
        in: [
          "ACCEPTED",
          "IN_PROGRESS",
        ],
      },
    },
  });

if (activeBooking) {
  throw new Error(
    "Worker already has an active booking"
  );
}
await prisma.workerProfile.update({
  where: {
    userId: workerId,
  },
  data: {
    isAvailable: false,
  },
});

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

export const customerStartBooking =
  async (
    bookingId: string,
    customerId: string
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
      booking.customerId !== customerId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    if (
      booking.status !== "ACCEPTED"
    ) {
      throw new Error(
        "Booking must be ACCEPTED"
      );
    }

    return prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "IN_PROGRESS",
        startedAt: new Date(),
        startedByCustomer: true,
      },
    });
};



export const completeBooking = async (
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
    throw new Error(
      "Only customer can complete booking"
    );
  }

  if (
    booking.status !== "IN_PROGRESS"
  ) {
    throw new Error(
      "Booking must be IN_PROGRESS"
    );
  }

  await prisma.workerProfile.update({
  where: {
    userId: booking.workerId,
  },
  data: {
    isAvailable: true,
  },
});

 return prisma.booking.update({
  where: { id: bookingId },
  data: {
    status: "COMPLETED",
    completedAt: new Date(),
    completedByCustomer: true,
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
  booking.status === "COMPLETED" ||
  booking.status === "CANCELLED"
) {
  throw new Error(
    "Booking already closed"
  );
}

  await prisma.workerProfile.update({
  where: {
    userId: booking.workerId,
  },
  data: {
    isAvailable: true,
  },
});

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });
};

export const markBookingPaid =
  async (
    bookingId: string,
    customerId: string,
    paymentMethod: string
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
      booking.customerId !== customerId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    return prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        paymentStatus: "PAID",
        paymentMethod,
      },
    });
};

export const requestReplacement =
  async (
    bookingId: string,
    customerId: string,
    reason: string
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
      booking.customerId !== customerId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    if (
  booking.status !== "NO_SHOW" &&
  booking.status !== "ACCEPTED"
) {
  throw new Error(
    "Replacement not allowed"
  );
}

    return prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        replacementRequested: true,
        replacementReason: reason,
      },
    });
};

export const markNoShow =
  async (
    bookingId: string,
    customerId: string
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
      booking.customerId !== customerId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    await prisma.workerProfile.update({
  where: {
    userId: booking.workerId,
  },
  data: {
    isAvailable: true,
  },
});

    return prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "NO_SHOW",
      },
    });
};