import express from "express";
import authRoutes from "../modules/auth/auth.routes";
import testRoutes from "../modules/auth/auth.test";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/test", testRoutes);

export default router;