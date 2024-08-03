import express from "express";
import * as SecurityGuardController from "../controllers/SecurityGuardController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();
router.post(
  "/registerDetails/:id",verifyToken,
  SecurityGuardController.LeaveRegisterController
);
router.get("/All", verifyToken,SecurityGuardController.GetDetailsController);

export default router;
