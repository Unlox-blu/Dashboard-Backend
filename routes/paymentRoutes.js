import express from "express";
import {
  getPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
  getPaymentsByCounselor,
  getTodaysPaymentsByCounselor
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { get } from "mongoose";

const router = express.Router();

router.get("/", getPeople);
// Counselor-specific payments (protected route)
router.get("/myCounselor", authMiddleware, getPaymentsByCounselor);
router.get("/todays-payments", authMiddleware, getTodaysPaymentsByCounselor);

router.get("/:id", getPersonById);
router.post("/", createPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);


export default router;