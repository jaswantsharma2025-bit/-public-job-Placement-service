import prisma from "../../config/prisma";

export const createReview = async (
  customerId: string,
  data: any
) => {
  const booking =
    await prisma.booking.findUnique({
      where: {
        id: data.bookingId,
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
    booking.status !== "COMPLETED"
  ) {
    throw new Error(
      "Booking not completed yet"
    );
  }

  const existingReview =
    await prisma.review.findUnique({
      where: {
        bookingId:
          data.bookingId,
      },
    });

  if (existingReview) {
    throw new Error(
      "Review already submitted"
    );
  }

  const review =
    await prisma.review.create({
      data: {
        bookingId:
          data.bookingId,

        customerId,

        workerId:
          booking.workerId,

        rating: data.rating,

        comment:
          data.comment,
      },
    });

  const reviews =
    await prisma.review.findMany({
      where: {
        workerId:
          booking.workerId,
      },
    });

  const totalReviews =
    reviews.length;

  const averageRating =
    reviews.reduce(
      (sum, review) =>
        sum + review.rating,
      0
    ) / totalReviews;

  await prisma.workerProfile.update({
    where: {
      userId:
        booking.workerId,
    },

    data: {
      rating:
        averageRating,

      totalReviews,
    },
  });

  return review;
};

export const getWorkerReviews =
  async (workerId: string) => {
    return prisma.review.findMany({
      where: {
        workerId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };