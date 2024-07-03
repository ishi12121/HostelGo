import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Staff from '../models/Staff.js';
import { asyncHandler } from '../handlers/errorHandlers.js';
import dotenv from 'dotenv';



export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    role: 'student',
  });

  await newUser.save();
  res.status(201).json({ status: 'success', message: 'User registered successfully' });
});

export const registerStaff = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newStaff = new Staff({
    email,
    password: hashedPassword,
    role: 'staff',
  });

  await newStaff.save();
  res.status(201).json({ status: 'success', message: 'Staff registered successfully' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const model = role === 'staff' ? Staff : User;
  const user = await model.findOne({ email });
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ status: 'error', message: 'Invalid password' });
  }

  const accessToken = jwt.sign(
    { email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '120m' }
  );

  const refreshToken = jwt.sign(
    { email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('accessToken', accessToken, { httpOnly: true });
  res.cookie('refreshToken', refreshToken, { httpOnly: true });
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    userId: user._id,
    role: user.role,
    accessToken,
    refreshToken,
  });
});

export const GetAllStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.find();
  res.status(200).json({ status: 'success', data: staff });
});
