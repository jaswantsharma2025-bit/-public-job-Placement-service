import { Request, Response } from "express";

import { getWorkers, getWorkerById } from "./worker.discovery.service";

export const fetchWorkers = async (req: Request, res: Response) => {
  try {
    // Accept comma-separated subCategoryIds, e.g. ?subCategoryIds=id1,id2
    const rawIds = req.query.subCategoryIds as string | undefined;
    const subCategoryIds = rawIds
      ? rawIds.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

    const workers = await getWorkers({
      subCategoryIds,
      city: req.query.city as string | undefined,
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
    res.status(400).json({ success: false, message: error.message });
  }
};

export const fetchWorkerById = async (req: Request, res: Response) => {
  try {
    const worker = await getWorkerById(req.params.id as string);
    res.status(200).json({ success: true, data: worker });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};