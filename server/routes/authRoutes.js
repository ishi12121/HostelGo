import express from "express";
import * as yup from "yup";
import * as authController from "../controllers/authController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Invalid field values",
      errorMessage: error.errors,
    });
  }
};

const registerSchema = yup.object({
  email: yup.string().email("Email is required").required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required(),
});

const loginSchema = yup.object({
  email: yup.string().email("Email is required").required(),
  password: yup.string().required("Password is required"),
  role: yup.string().required("Role is required"),
});

const registerSecuritySchema = yup.object({
  email: yup.string().email("Email is required").required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required(),
});

router.post(
  "/register/user",
  validateRequest(registerSchema),
  authController.registerUser
);
router.post(
  "/register/staff",
  validateRequest(registerSchema),
  authController.registerStaff
);
router.post(
  "/register/security",
  validateRequest(registerSecuritySchema),
  authController.registerSecurity
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/getStaff",verifyToken ,authController.GetAllStaff);
router.post("/refresh",authController.refreshToken)

export default router;
