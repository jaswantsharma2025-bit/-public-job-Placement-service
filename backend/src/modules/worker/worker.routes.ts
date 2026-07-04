import express from "express";

import { authMiddleware } from "../../middleware/authMiddleware";
import { authorizeRoles } from "../../middleware/roleMiddleware";

import {
  createProfile,
  earnings,
  getCategories,
  getProfile,
  updateProfile,
  updateWorkerLocation,
  toggleAvailability,
} from "./worker.controller";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
// GET /api/worker/categories — used by frontend skill pickers (no auth needed)
router.get("/categories", getCategories);

// ── Worker-authenticated ──────────────────────────────────────────────────────
router.use(authMiddleware, authorizeRoles("WORKER"));

router.post("/profile",       createProfile);
router.get("/profile",        getProfile);
router.put("/profile",        updateProfile);
router.patch("/availability", toggleAvailability);
router.patch("/location",     updateWorkerLocation);
router.get("/earnings",       earnings);

export default router;