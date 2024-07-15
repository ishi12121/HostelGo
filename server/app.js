import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const corsOptions = {
  origin: process.env.CORS_URL,
};

app.use(cors(corsOptions));

// Custom token to log request body
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

// Custom token to log cookies
morgan.token("cookies", (req) => {
  return JSON.stringify(req.cookies);
});

// Custom Morgan for logging
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
      `Payload: ${tokens.body(req, res)}`, // Log the request body
      `Cookies: ${tokens.cookies(req, res)}`, // Log the cookies
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

// Import routes
import opDetailsRoutes from "./routes/opDetailsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import SecurityGuardRoutes from "./routes/SecurityGuardRoutes.js";
// Use routes
app.use("/opDetails", opDetailsRoutes);
app.use("/auth", authRoutes);
app.use("/guard", SecurityGuardRoutes);

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
