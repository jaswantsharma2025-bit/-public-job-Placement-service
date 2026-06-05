import { Request, Response } from "express";

export const getCategories = (
  req: Request,
  res: Response
) => {

  res.json({
    success: true,

    data: [
      "MAID",
      "COOK",
      "DRIVER",
      "NURSE",
      "PLUMBER",
      "ELECTRICIAN",
    ],
  });
};