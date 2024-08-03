import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  role: { type: String, required: true},
  email: { type: String, required: true},
  password: { type: String, required: true },
});

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
