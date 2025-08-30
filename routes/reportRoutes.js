import express from "express";
import {
  getReports,
  getReportById,
  updateReport,
  deleteReport
} from "../controllers/reportController.js";

const router = express.Router();

// Routes
router.get("/", getReports);
router.get("/:id", getReportById);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;

