import express from "express";
import * as SecurityGuardController from "../controllers/SecurityGuardController.js";

const router = express.Router();
router.post(
  "/registerDetails/:id",
  SecurityGuardController.LeaveRegisterController
);
router.get("/All", SecurityGuardController.GetDetailsController);

export default router;
