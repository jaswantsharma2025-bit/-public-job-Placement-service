import express from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import { authorizeRoles } from "../../middleware/roleMiddleware";

import {
  createProfile,
  earnings,
  getProfile,
  updateProfile,
  updateWorkerLocation,
  toggleAvailability,
} from "./worker.controller";

const router = express.Router();

router.use(
  authMiddleware,
  authorizeRoles("WORKER")
);

router.post(
  "/profile",
  createProfile
);

router.get(
  "/profile",
  getProfile
);

router.put(
  "/profile",
  updateProfile
);

router.patch(
  "/availability",
  authMiddleware,
  authorizeRoles("WORKER"),
  toggleAvailability
);

router.patch(
  "/location",
  authMiddleware,
  authorizeRoles("WORKER"),
  updateWorkerLocation
);

router.get(
  "/earnings",
  authMiddleware,
  authorizeRoles("WORKER"),
  earnings
);



export default router;