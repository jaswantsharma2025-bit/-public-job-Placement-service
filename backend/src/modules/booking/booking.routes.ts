import express from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import {
  createBookingHandler,
  myBookings,
  workerBookings,
  bookingDetails,
  acceptBookingHandler,
  rejectBookingHandler,
  cancelBookingHandler,
  completeBookingHandler,
  markPaidHandler,
  replacementHandler,
  noShowHandler,
  customerStartBookingHandler,
} from "./booking.controller";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  createBookingHandler
);

router.get(
  "/my",
  myBookings
);

router.get(
  "/worker/my",
  workerBookings
);

router.get(
  "/:id",
  bookingDetails
);

router.patch(
  "/:id/accept",
  acceptBookingHandler
);

router.patch(
  "/:id/reject",
  rejectBookingHandler
);

router.patch(
  "/:id/customer-start",
  customerStartBookingHandler
);

router.patch(
  "/:id/customer-complete",
  completeBookingHandler
);

router.patch(
  "/:id/cancel",
  cancelBookingHandler
);

router.patch(
  "/:id/pay",
  markPaidHandler
);

router.patch(
  "/:id/replacement",
  replacementHandler
);

router.patch(
  "/:id/no-show",
  noShowHandler
);

export default router;