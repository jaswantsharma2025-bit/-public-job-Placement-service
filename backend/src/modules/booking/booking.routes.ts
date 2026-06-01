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
  startBookingHandler,
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
  "/:id/start",
  startBookingHandler
);

router.patch(
  "/:id/complete",
  completeBookingHandler
);

router.patch(
  "/:id/cancel",
  cancelBookingHandler
);

export default router;