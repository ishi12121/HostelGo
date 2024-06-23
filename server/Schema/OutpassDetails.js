const mongoose = require("mongoose");

const OutpassSchema = new mongoose.Schema({
  name: String,
  rollno: {
    type: String,
  },
  department: String,
  year: String,
  dateFrom: String,
  dateTo: String,
  timeFrom: String,
  timeTo: String,
  phNo: Number,
  parentPhNo: Number,
  reason: String,
  city: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  qrurl: String,
  isAccept: {
    type: Boolean,
    default: false,
  },
  isWait: {
    type: Boolean,
    default: true,
  },
  rejectReason: {
    type: String,
    default: "",
  },
});

const opDetailsModel = mongoose.model("OutpassDetails", OutpassSchema);

module.exports = opDetailsModel;
