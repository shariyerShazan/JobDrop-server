import express from "express";
import { isAuthed } from "../middlewares/isAuthed.js";
import {
  applyJob,
  getApplicantForAdmin,
  getAppliedJobForStudent,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply-job/:id", isAuthed, applyJob);
router.get("/get-applied-jobs", isAuthed, getAppliedJobForStudent);
router.get("/get-applicant", isAuthed, getApplicantForAdmin);
router.put("/update-status/:id", isAuthed, updateStatus);
 

export default router;
