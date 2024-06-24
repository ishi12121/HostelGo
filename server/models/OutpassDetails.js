const mongoose = require('mongoose');

const outpassDetailsSchema = new mongoose.Schema({
  name: String,
  department: String,
  rollno: String,
  year: String,
  dateFrom: Date,
  dateTo: Date,
  timeFrom: String,
  timeTo: String,
  phNo: Number,
  qrurl: String,
  parentPhNo: Number,
  reason: String,
  city: String,
  isAccept: Boolean,
  isWait: Boolean,
  rejectReason: String
});

module.exports = mongoose.model('OutpassDetails', outpassDetailsSchema);
