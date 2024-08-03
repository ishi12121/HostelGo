import mongoose from "mongoose";

const SecurityRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ApprovedBy: {
    type: String,
    required: true,
  },
  ScannedDate: {
    type: Date,
    required: true,
  },

  PhoneNo: {
    type: String,
    required: true,
  },

  ParentPhoneNo: {
    type: String,
    required: true,
  },

  Address: {
    type: String,
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },
});

const SecurityRegister = mongoose.model(
  "SecurityRegister",
  SecurityRegisterSchema
);
export default SecurityRegister;
