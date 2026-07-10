import prisma from "../../config/prisma";

export const getPendingWorkers = async () => {
  return prisma.workerProfile.findMany({
    where: { isVerified: false, rejectionReason: null },
    include: {
      user: true,
      skills: { include: { subCategory: { include: { category: true } } } },
    },
  });
};

export const approveWorker = async (userId: string, adminId: string) => {
  return prisma.workerProfile.update({
    where: { userId },
    data: { isVerified: true, verifiedAt: new Date(), verifiedBy: adminId, rejectionReason: null },
  });
};

export const rejectWorker = async (userId: string, reason: string) => {
  return prisma.workerProfile.update({ where: { userId }, data: { isVerified: false, rejectionReason: reason } });
};

export const suspendWorker = async (userId: string, reason: string) => {
  return prisma.workerProfile.update({ where: { userId }, data: { isSuspended: true, suspensionReason: reason } });
};

export const reactivateWorker = async (userId: string) => {
  return prisma.workerProfile.update({ where: { userId }, data: { isSuspended: false, suspensionReason: null } });
};

export const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: { subCategory: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const getAnalytics = async () => {
  const totalCustomers    = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const totalWorkers      = await prisma.user.count({ where: { role: "WORKER" } });
  const verifiedWorkers   = await prisma.workerProfile.count({ where: { isVerified: true } });
  const totalBookings     = await prisma.booking.count();
  const completedBookings = await prisma.booking.count({ where: { status: "COMPLETED" } });
  const revenueData       = await prisma.booking.aggregate({ _sum: { platformFee: true } });
  const totalPendingPayouts = await prisma.workerWallet.aggregate({ _sum: { pendingBalance: true } });

  return {
    totalCustomers,
    totalWorkers,
    verifiedWorkers,
    totalBookings,
    completedBookings,
    totalRevenue:        revenueData._sum.platformFee || 0,
    totalPendingPayouts: totalPendingPayouts._sum.pendingBalance || 0,
  };
};

export const forceCompleteBooking = async (bookingId: string) => {
  return prisma.booking.update({ where: { id: bookingId }, data: { status: "COMPLETED", completedAt: new Date() } });
};

export const forceCancelBooking = async (bookingId: string) => {
  return prisma.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED", cancelledAt: new Date() } });
};

export const reassignBooking = async (bookingId: string, newWorkerId: string) => {
  const worker = await prisma.workerProfile.findUnique({ where: { userId: newWorkerId }, include: { user: true } });
  if (!worker)            throw new Error("Worker not found");
  if (!worker.isVerified)  throw new Error("Worker not verified");
  if (worker.isSuspended)  throw new Error("Worker suspended");
  if (!worker.isAvailable) throw new Error("Worker unavailable");

  return prisma.booking.update({
    where: { id: bookingId },
    data: { workerId: newWorkerId, workerName: worker.user.name, workerPhone: worker.user.phone, status: "PENDING", acceptedAt: null },
  });
};

export const getReplacementCandidates = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");

  return prisma.workerProfile.findMany({
    where: {
      isVerified: true, isAvailable: true, isSuspended: false,
      city: booking.city, userId: { not: booking.workerId },
      skills: { some: { subCategoryId: booking.subCategoryId } },
    },
    include: {
      user: true,
      skills: { include: { subCategory: { include: { category: true } } } },
    },
  });
};

// ── Platform Payment Info ─────────────────────────────────────────────────────

export const getPlatformPaymentInfo = async () => {
  // Always return the first (and only) record
  return prisma.platformPaymentInfo.findFirst();
};

export const upsertPlatformPaymentInfo = async (
  adminId: string,
  data: { upiId: string; upiName: string; qrImageUrl?: string }
) => {
  const existing = await prisma.platformPaymentInfo.findFirst();

  if (existing) {
    return prisma.platformPaymentInfo.update({
      where: { id: existing.id },
      data: { ...data, updatedBy: adminId },
    });
  }

  return prisma.platformPaymentInfo.create({
    data: { ...data, updatedBy: adminId },
  });
};

// ── Wallet / Settlement ───────────────────────────────────────────────────────

export const getAllWorkerWallets = async () => {
  return prisma.workerWallet.findMany({
    include: {
      workerProfile: {
        include: {
          user:   { select: { id: true, name: true, phone: true } },
          skills: { include: { subCategory: true }, take: 3 },
        },
      },
      settlements: { orderBy: { createdAt: "desc" }, take: 3 },
    },
    orderBy: { pendingBalance: "desc" },
  });
};

export const settleWorkerWallet = async (workerProfileId: string, adminId: string, note?: string) => {
  const wallet = await prisma.workerWallet.findUnique({ where: { workerProfileId } });
  if (!wallet)                    throw new Error("Wallet not found");
  if (wallet.pendingBalance <= 0) throw new Error("No pending balance to settle");

  const amount = wallet.pendingBalance;

  await prisma.workerWallet.update({
    where: { id: wallet.id },
    data:  { pendingBalance: 0, settledBalance: { increment: amount } },
  });

  await prisma.walletTransaction.create({
    data: { walletId: wallet.id, type: "DEBIT", amount, description: note || "Admin settlement" },
  });

  const settlement = await prisma.settlement.create({
    data: { walletId: wallet.id, settledBy: adminId, amount, note: note || null },
  });

  return {
    wallet: await prisma.workerWallet.findUnique({ where: { id: wallet.id } }),
    settlement,
  };
};

export const getWorkerWalletById = async (workerProfileId: string) => {
  const wallet = await prisma.workerWallet.findUnique({
    where: { workerProfileId },
    include: {
      workerProfile: { include: { user: { select: { id: true, name: true, phone: true } } } },
      transactions:  { orderBy: { createdAt: "desc" } },
      settlements:   { orderBy: { createdAt: "desc" } },
    },
  });
  if (!wallet) throw new Error("Wallet not found");
  return wallet;
};