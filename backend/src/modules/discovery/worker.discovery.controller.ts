import { Request, Response } from "express";

import {
  getWorkers,
  getWorkerById,
} from "./worker.discovery.service";

export const fetchWorkers = async (
  req: Request,
  res: Response
) => {
  try {
    const workers =
      await getWorkers({
        skillCategory:
          req.query.skillCategory as string,

        city: req.query.city as string,

        isAvailable:
          req.query.isAvailable === "true"
            ? true
            : req.query.isAvailable === "false"
            ? false
            : undefined,

        isVerified:
          req.query.isVerified === "true"
            ? true
            : req.query.isVerified === "false"
            ? false
            : undefined,
      });

    res.status(200).json({
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

export const fetchWorkerById = async (
  req: Request,
  res: Response
) => {
  try {
   const worker =
  await getWorkerById(
    req.params.id as string
  );

    res.status(200).json({
      success: true,
      data: worker,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};