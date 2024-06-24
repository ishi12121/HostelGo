require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cookieparser());

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
    console.log("Connected");
  } catch (error) {
    console.log("Not Connected :", error.message);
  }
}

checkConnection();

app.use("/opDetails", require("./routes/opDetailsRoutes"));
app.use("/checkReq", require("./routes/checkReqRoutes"));
app.use("/auth", require("./routes/authRoutes"));

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
