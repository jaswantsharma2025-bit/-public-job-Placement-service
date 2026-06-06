import { Response } from "express";

import { AuthRequest } from "../../middleware/authMiddleware";

import {
  createComplaintSchema,
} from "./complaints.validation";

import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  resolveComplaint,
  rejectComplaint,
} from "./complaints.service";

export const createComplaintHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const data =
        createComplaintSchema.parse(
          req.body
        );

      const complaint =
        await createComplaint(
          req.user!.userId,
          data
        );

      res.status(201).json({
        success: true,
        data: complaint,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const myComplaintsHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const complaints =
        await getMyComplaints(
          req.user!.userId
        );

      res.json({
        success: true,
        count: complaints.length,
        data: complaints,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const allComplaintsHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const complaints =
        await getAllComplaints();

      res.json({
        success: true,
        count: complaints.length,
        data: complaints,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const resolveComplaintHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const complaint =
        await resolveComplaint(
          req.params.id as string,
          req.body.adminNotes
        );

      res.json({
        success: true,
        data: complaint,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const rejectComplaintHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const complaint =
        await rejectComplaint(
          req.params.id as string,
          req.body.adminNotes
        );

      res.json({
        success: true,
        data: complaint,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };