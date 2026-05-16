import express from "express";
import {
  authMiddleware,
  AuthRequest,
} from "../../middleware/authMiddleware";
import { authorizeRoles } from "../../middleware/roleMiddleware";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

router.get(
  "/admin-only",
  authMiddleware,
  authorizeRoles("ADMIN"),
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

export default router;