import { Response } from "express";

import { AuthRequest } from "../../middleware/authMiddleware";

import {
  createWorkerProfile,
  getWorkerEarnings,
  getWorkerProfile,
  updateAvailability,
  updateLocation,
  updateWorkerProfile,
} from "./worker.service";

import {
  workerProfileSchema,
  updateWorkerProfileSchema,
  availabilitySchema,
  locationSchema,
} from "./worker.validation";

export const createProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const validatedData =
      workerProfileSchema.parse(req.body);

    const profile =
      await createWorkerProfile(
        req.user!.userId,
        validatedData
      );

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const profile =
      await getWorkerProfile(
        req.user!.userId
      );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const validatedData =
      updateWorkerProfileSchema.parse(
        req.body
      );

    const profile =
      await updateWorkerProfile(
        req.user!.userId,
        validatedData
      );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data =
      availabilitySchema.parse(
        req.body
      );

    const result =
      await updateAvailability(
        req.user!.userId,
        data.isAvailable
      );

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

export const updateWorkerLocation =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const data =
        locationSchema.parse(
          req.body
        );

      const result =
        await updateLocation(
          req.user!.userId,
          data
        );

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

  export const earnings =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const result =
        await getWorkerEarnings(
          req.user!.userId
        );

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