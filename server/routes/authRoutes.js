const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");

router.post(
  "/register/user",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  authController.registerUser
);

router.post(
  "/register/staff",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  authController.registerStaff
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  authController.login
);

router.post("/refresh-token", authController.refreshToken);

module.exports = router;
