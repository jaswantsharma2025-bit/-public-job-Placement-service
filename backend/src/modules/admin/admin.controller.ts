import { Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";

import {
  getPendingWorkers,
  approveWorker,
  rejectWorker,
  suspendWorker,
  reactivateWorker,
  getAllBookings,
  getAnalytics,
  reassignBooking,
  forceCompleteBooking,
  forceCancelBooking,
  getReplacementCandidates,
} from "./admin.service";

export const pendingWorkers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const workers =
      await getPendingWorkers();

    res.json({
      success: true,
      count: workers.length,
      data: workers,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveWorkerHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const worker =
        await approveWorker(
          String(req.params.userId),
          req.user!.userId
        );

      res.json({
        success: true,
        data: worker,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const rejectWorkerHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const worker =
        await rejectWorker(
          String(req.params.userId),
          req.body.reason
        );

      res.json({
        success: true,
        data: worker,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const suspendWorkerHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const worker =
        await suspendWorker(
          String(req.params.userId),
          req.body.reason
        );

      res.json({
        success: true,
        data: worker,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const reactivateWorkerHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const worker =
        await reactivateWorker(
          String(req.params.userId)
        );

      res.json({
        success: true,
        data: worker,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const bookings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result =
      await getAllBookings();

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const analytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result =
      await getAnalytics();

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forceCompleteBookingHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const booking =
        await forceCompleteBooking(
          String(req.params.id)
        );

      res.json({
        success: true,
        data: booking,
      });

    } catch (error: any) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }
};

export const forceCancelBookingHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const booking =
        await forceCancelBooking(
          String(req.params.id)
        );

      res.json({
        success: true,
        data: booking,
      });

    } catch (error: any) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }
};

export const reassignBookingHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const booking =
        await reassignBooking(
          String(req.params.id),
          req.body.newWorkerId
        );

      res.json({
        success: true,
        data: booking,
      });

    } catch (error: any) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }
};

export const replacementCandidates =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const workers =
        await getReplacementCandidates(
          String(req.params.id)
        );

      res.json({
        success: true,
        count: workers.length,
        data: workers,
      });

    } catch (error: any) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }
};