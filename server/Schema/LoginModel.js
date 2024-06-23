const mongoose = require("mongoose");

//user => student
const userschema = new mongoose.Schema({
  role: String,
  email: String,
  password: String,
});

const staffschema = new mongoose.Schema({
  role: String,
  email: String,
  password: String,
});

const usermodel = mongoose.model("user", userschema);
const staffmodel = mongoose.model("staffs", staffschema);
module.exports = { usermodel, staffmodel };
