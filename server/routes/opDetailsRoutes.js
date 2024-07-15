import express from "express";
import * as opDetailsController from "../controllers/opDetailsController.js";

const router = express.Router();

router.post("/", opDetailsController.createOpDetails);
router.get("/", opDetailsController.getOpDetails);
router.post("/assign", opDetailsController.AssigntoStaff);
router.post("/accept", opDetailsController.acceptRequest);
router.get("/staff/:staffId", opDetailsController.getOpDetailsByStaffId);
router.post("/reject", opDetailsController.rejectRequest);
router.get("/user/:userId", opDetailsController.getOpDetailsByUserId);
router.get("/verifyOutpass/:id", opDetailsController.verifyOutpassTicket);
export default router;
