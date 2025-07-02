import express from "express";
import { changePassword, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import { isAuthed } from "../middlewares/isAuthed.js";


const router = express.Router();

router.post("/register" , register)
router.post("/login" , login) 
router.post("/logout",isAuthed ,logout);
router.put("/update-profile", isAuthed, updateProfile);
router.put("/change-password", isAuthed, changePassword); 
// router.put("/update", isAuthed , updateUser); 
export default router;
