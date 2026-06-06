import express from "express";

import {
  fetchWorkers,
  fetchWorkerById,
} from "./worker.discovery.controller";

const router = express.Router();

router.get("/", fetchWorkers);

router.get("/:id", fetchWorkerById);

export default router;