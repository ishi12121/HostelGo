import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import Security from "../models/Security.js";
import { asyncHandler } from "../handlers/errorHandlers.js";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: "student",
    });

    await newUser.save();
    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (error) {
    return res.status(403).json({ status: "error", message: error });
  }
});

export const registerStaff = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      email,
      password: hashedPassword,
      role: "staff",
    });

    await newStaff.save();
    res
      .status(201)
      .json({ status: "success", message: "Staff registered successfully" });
  } catch (error) {
    return res.status(403).json({ status: "error", message: error });
  }
});

export const registerSecurity = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSecurity = new Security({
      email: email,
      password: hashedPassword,
      role: "security",
    });

    await newSecurity.save();
    res
      .status(201)
      .json({ status: "success", message: "Security registered successfully" });
  } catch (error) {
    return res.status(403).json({ status: "error", message: error });
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const model =
      role === "staff" ? Staff : role === "security" ? Security : User;
    const user = await model.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "120m" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(200).json({
      status: "success",
      message: "Login successful",
      userId: user._id,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(403).json({ status: "error", message: error });
  }
});

export const GetAllStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.find();
  res.status(200).json({ status: "success", data: staff });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.header('Refresh-Token');

  if (!refreshToken) {
    return res.status(401).json({ status: 'error', message: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { email, role } = decoded;

    const model = role === 'staff' ? Staff : role === 'security' ? Security : User;
    const user = await model.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '120m' }
    );

    const newRefreshToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403).json({ status: 'error', message: 'Invalid refresh token' });
  }
});