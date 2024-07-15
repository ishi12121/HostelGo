import mongoose from "mongoose";

const outpassDetailsSchema = new mongoose.Schema({
  staffId: String,
  userId: String,
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
  isScanned: Boolean,
});

const OutpassDetails = mongoose.model("OutpassDetails", outpassDetailsSchema);
export default OutpassDetails;
