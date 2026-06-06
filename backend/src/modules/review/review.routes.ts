import express from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import {
  createReviewHandler,
  workerReviews,
} from "./review.controller";

const router =
  express.Router();

router.use(authMiddleware);

router.post(
  "/",
  createReviewHandler
);

router.get(
  "/worker/:workerId",
  workerReviews
);

export default router;