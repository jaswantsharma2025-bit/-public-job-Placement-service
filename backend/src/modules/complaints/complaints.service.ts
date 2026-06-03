import prisma from "../../config/prisma";

export const createComplaint = async (
  userId: string,
  data: any
) => {
  const booking =
    await prisma.booking.findUnique({
      where: {
        id: data.bookingId,
      },
    });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return prisma.complaint.create({
    data: {
      bookingId: data.bookingId,

      raisedByUserId: userId,

      againstUserId:
        data.againstUserId,

      reason: data.reason,

      description:
        data.description,
    },
  });
};

export const getMyComplaints =
  async (userId: string) => {
    return prisma.complaint.findMany({
      where: {
        raisedByUserId: userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const getAllComplaints =
  async () => {
    return prisma.complaint.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const resolveComplaint =
  async (
    complaintId: string,
    adminNotes?: string
  ) => {
    return prisma.complaint.update({
      where: {
        id: complaintId,
      },

      data: {
        status: "RESOLVED",

        adminNotes,
      },
    });
  };

export const rejectComplaint =
  async (
    complaintId: string,
    adminNotes?: string
  ) => {
    return prisma.complaint.update({
      where: {
        id: complaintId,
      },

      data: {
        status: "REJECTED",

        adminNotes,
      },
    });
  };