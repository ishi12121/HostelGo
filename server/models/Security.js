import mongoose from "mongoose";

const SecuritySchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Security = mongoose.model("security", SecuritySchema);
export default Security;
