import { Response } from "express";

import { AuthRequest } from "../../middleware/authMiddleware";

import {
  createCustomerProfile,
  getCustomerProfile,
  updateCustomerProfile,
} from "./customer.service";

import {
  customerProfileSchema,
  updateCustomerProfileSchema,
} from "./customer.validation";

export const createProfile =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const data =
        customerProfileSchema.parse(
          req.body
        );

      const profile =
        await createCustomerProfile(
          req.user!.userId,
          data
        );

      res.status(201).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getProfile =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const profile =
        await getCustomerProfile(
          req.user!.userId
        );

      res.json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const updateProfile =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const data =
        updateCustomerProfileSchema.parse(
          req.body
        );

      const profile =
        await updateCustomerProfile(
          req.user!.userId,
          data
        );

      res.json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };