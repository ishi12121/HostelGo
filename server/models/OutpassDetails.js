const mongoose = require("mongoose");

const outpassDetailsSchema = new mongoose.Schema({
  staffId: String,
  name: String,
  department: String,
  rollno: String,
  year: String,
  dateFrom: Date,
  dateTo: Date,
  timeFrom: String,
  timeTo: String,
  phNo: Number,
  parentPhNo: Number,
  reason: String,
  city: String,
  isAccept: Boolean,
  rejectReason: String,
  
});

module.exports = mongoose.model("OutpassDetails", outpassDetailsSchema);
