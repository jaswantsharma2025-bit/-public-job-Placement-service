import express from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import { authorizeRoles } from "../../middleware/roleMiddleware";

import {
  createComplaintHandler,
  myComplaintsHandler,
  allComplaintsHandler,
  resolveComplaintHandler,
  rejectComplaintHandler,
} from "./complaints.controller";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createComplaintHandler
);

router.get(
  "/my",
  authMiddleware,
  myComplaintsHandler
);

router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("ADMIN"),
  allComplaintsHandler
);

router.patch(
  "/admin/:id/resolve",
  authMiddleware,
  authorizeRoles("ADMIN"),
  resolveComplaintHandler
);

router.patch(
  "/admin/:id/reject",
  authMiddleware,
  authorizeRoles("ADMIN"),
  rejectComplaintHandler
);

export default router;