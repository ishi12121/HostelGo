require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());

const corsOptions = {
  origin: process.env.CORS_URL,
};
app.use(cors(corsOptions));

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

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
