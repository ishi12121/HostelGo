const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Corrected the file name to match the actual file name
const Staff = require("../models/Staff");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.registerStaff = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      email,
      password: hashedPassword,
      role,
    });

    await newStaff.save();
    res.status(201).send({ message: "Staff registered successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
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

    const token = jwt.sign(
      { email: user.email, role: user.role },
      "secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
