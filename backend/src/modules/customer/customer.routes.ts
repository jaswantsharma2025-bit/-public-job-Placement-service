import express from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import { authorizeRoles } from "../../middleware/roleMiddleware";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "./customer.controller";

const router = express.Router();

router.use(
  authMiddleware,
  authorizeRoles("CUSTOMER")
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

export default router;