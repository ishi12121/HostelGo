import express from "express";
import * as opDetailsController from "../controllers/opDetailsController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/",verifyToken ,opDetailsController.createOpDetails);
router.get("/",verifyToken ,opDetailsController.getOpDetails);
router.post("/assign", verifyToken,opDetailsController.AssigntoStaff);
router.post("/accept", verifyToken,opDetailsController.acceptRequest);
router.get("/staff/:staffId", verifyToken,opDetailsController.getOpDetailsByStaffId);
router.post("/reject", verifyToken,opDetailsController.rejectRequest);
router.get("/user/:userId",verifyToken ,verifyToken,opDetailsController.getOpDetailsByUserId);
router.get("/verifyOutpass/:id", verifyToken,opDetailsController.verifyOutpassTicket);
export default router;
