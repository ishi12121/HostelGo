import opDetailsModel from "../models/OutpassDetails.js";
import SecurityRegister from "../models/SecurityRegister.js";
import { asyncHandler } from "../handlers/errorHandlers.js";
import Staff from "../models/Staff.js";

export const LeaveRegisterController = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const outpass = await opDetailsModel.findById(id);
    if (outpass?.isScanned === true) {
      return res
        .status(202)
        .json({ status: "success", message: "Already Scanned" });
    }
    const staff = await Staff.findById(outpass?.staffId);
    const leaveRegister = await SecurityRegister.create({
      name: outpass?.name,
      ApprovedBy: staff?.email,
      ScannedDate: new Date().toISOString(),
      PhoneNo: outpass?.phNo,
      ParentPhoneNo: outpass?.parentPhNo,
      Address: outpass?.city,
      reason: outpass?.reason,
    });
    const data = await opDetailsModel.findOneAndUpdate(
      { _id: id },
      { isScanned: true },
      { new: true }
    );
    if (!leaveRegister) {
      throw new Error("Failed to create leaveRegister");
    }
    res.status(200).json({
      data: leaveRegister,
      isScanned: data?.isScanned,
      status: "success",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error });
  }
});

export const GetDetailsController = asyncHandler(async (req, res) => {
  try {
    const data = await SecurityRegister.find();
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error });
  }
});
