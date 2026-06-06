import express from "express";

import { authMiddleware } from "../../middleware/authMiddleware";
import { authorizeRoles } from "../../middleware/roleMiddleware";

import {
  pendingWorkers,
  approveWorkerHandler,
  rejectWorkerHandler,
  suspendWorkerHandler,
  reactivateWorkerHandler,
  bookings,
  analytics,
  reassignBookingHandler,
  forceCancelBookingHandler,
  forceCompleteBookingHandler,
  replacementCandidates,
} from "./admin.controller";

const router = express.Router();

router.use(
  authMiddleware,
  authorizeRoles("ADMIN")
);

router.get(
  "/workers/pending",
  pendingWorkers
);

router.patch(
  "/workers/:userId/approve",
  approveWorkerHandler
);

router.patch(
  "/workers/:userId/reject",
  rejectWorkerHandler
);

router.patch(
  "/workers/:userId/suspend",
  suspendWorkerHandler
);

router.patch(
  "/workers/:userId/reactivate",
  reactivateWorkerHandler
);

router.get(
  "/bookings",
  bookings
);

router.get(
  "/analytics",
  analytics
);

router.patch(
  "/bookings/:id/complete",
  forceCompleteBookingHandler
);

router.patch(
  "/bookings/:id/cancel",
  forceCancelBookingHandler
);

router.patch(
  "/bookings/:id/reassign",
  reassignBookingHandler
);

router.get(
  "/bookings/:id/replacement-candidates",
  replacementCandidates
);
export default router;