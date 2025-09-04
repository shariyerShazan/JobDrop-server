import express from "express";
import { isAuthed } from "../middlewares/isAuthed.js";
import { createJob, deleteJobByAdmin, getAdminJobs, getAllJobs, getJobById, updateJobByAdmin } from "../controllers/job.controller.js";


const router = express.Router();

router.post("/create-job" ,isAuthed , createJob)
router.get("/get-all-job"  , getAllJobs) 
router.get("/get-job-byId/:id" ,getJobById);
router.get("/get-admin-job",isAuthed ,getAdminJobs);
router.delete("/delete-job-admin/:id",isAuthed ,deleteJobByAdmin);
router.put("/update-job-admin/:id",isAuthed ,updateJobByAdmin);

export default router;
