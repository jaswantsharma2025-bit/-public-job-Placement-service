import { Response } from "express";

import { AuthRequest } from "../../middleware/authMiddleware";

import {
  createReview,
  getWorkerReviews,
} from "./review.service";

import {
  createReviewSchema,
} from "./review.validation";

export const createReviewHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const data =
        createReviewSchema.parse(
          req.body
        );

      const review =
        await createReview(
          req.user!.userId,
          data
        );

      res.status(201).json({
        success: true,
        data: review,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const workerReviews =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const reviews =
        await getWorkerReviews(
          String(
            req.params.workerId
          )
        );

      res.json({
        success: true,
        count:
          reviews.length,
        data: reviews,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };