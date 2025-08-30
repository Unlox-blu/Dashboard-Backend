import express from "express";
import {
  getPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getPeople);
router.get("/:id", getPersonById);
router.post("/", createPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

export default router;

