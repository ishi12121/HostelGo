const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Staff = require("../models/Staff");
const { asyncHandler } = require("../handlers/errorHandlers");
require("dotenv").config();
exports.registerUser = asyncHandler(async (req, res) => {
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
      .send({ status: "success", message: "User registered successfully" });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

exports.registerStaff = asyncHandler(async (req, res) => {
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
      .send({ status: "success", message: "Staff registered successfully" });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

exports.login = asyncHandler(async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const model = role === "staff" ? Staff : User;
    const user = await model.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid password" });
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
    res.status(200).send({
      status: "success",
      message: "Login successful",
      role:user?.role,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});
