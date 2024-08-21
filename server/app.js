import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

morgan.token("cookies", (req) => {
  return JSON.stringify(req.cookies);
});

app.use(
  morgan((tokens, req, res) => {
    return [
      `Method: ${tokens.method(req, res)}`,
      `URL: ${tokens.url(req, res)}`,
      `Status: ${tokens.status(req, res)}`,
      `Content-Length: ${tokens.res(req, res, "content-length")}`,
      `- Response Time: ${tokens["response-time"](req, res)} ms`,
      `IP: ${tokens["remote-addr"](req, res)}`,
      `User-Agent: ${tokens["user-agent"](req, res)}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Payload: ${tokens.body(req, res)}`,
      `Cookies: ${tokens.cookies(req, res)}`,
    ].join(" | ");
  })
);

async function checkConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
}

checkConnection();

import opDetailsRoutes from "./routes/opDetailsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import SecurityGuardRoutes from "./routes/SecurityGuardRoutes.js";

app.use("/opDetails", opDetailsRoutes);
app.use("/auth", authRoutes);
app.use("/guard", SecurityGuardRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
