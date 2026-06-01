import prisma from "../../config/prisma";

export const createCustomerProfile =
  async (
    userId: string,
    data: any
  ) => {
    const existing =
      await prisma.customerProfile.findUnique({
        where: {
          userId,
        },
      });

    if (existing) {
      throw new Error(
        "Profile already exists"
      );
    }

    return prisma.customerProfile.create({
      data: {
        userId,
        ...data,
      },
    });
  };

export const getCustomerProfile =
  async (userId: string) => {
    const profile =
      await prisma.customerProfile.findUnique({
        where: {
          userId,
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

    if (!profile) {
      throw new Error(
        "Profile not found"
      );
    }

    return profile;
  };

export const updateCustomerProfile =
  async (
    userId: string,
    data: any
  ) => {
    const profile =
      await prisma.customerProfile.findUnique({
        where: {
          userId,
        },
      });

    if (!profile) {
      throw new Error(
        "Profile not found"
      );
    }

    return prisma.customerProfile.update({
      where: {
        userId,
      },

      data,
    });
  };