const mongoose = require("mongoose");
const shema = new mongoose.Schema({
  rollNo: {
    type: String,
  },
  reqStatus: {
    type: Boolean,
    default: 0,
  },
});
const reqStatus = mongoose.model("reqStatus", shema);

module.exports = reqStatus;
