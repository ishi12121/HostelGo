import opDetailsModel from "../models/OutpassDetails.js";
import { asyncHandler } from "../handlers/errorHandlers.js";

// Create a new outpass detail
export const createOpDetails = asyncHandler(async (req, res) => {
  const {
    name,
    userId,
    department,
    rollno,
    year,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
    phNo,
    parentPhNo,
    reason,
    city,
  } = req.body;

  const opFormDetails = await opDetailsModel.create({
    staffId: null,
    name,
    userId,
    department,
    rollno,
    year,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
    phNo,
    parentPhNo,
    isAccept: null,
    reason,
    city,
    isScanned: false,
  });

  if (!opFormDetails) {
    throw new Error("Failed to create opFormDetails");
  }

  res.status(200).json({ data: opFormDetails, status: "success" });
});

// Get all outpass details
export const getOpDetails = asyncHandler(async (req, res) => {
  const data = await opDetailsModel.find();
  res.status(200).json({ data });
});

// Get outpass details by user ID
export const getOpDetailsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const data = await opDetailsModel.find({ userId });

  if (data.length === 0) {
    return res
      .status(404)
      .json({ status: "error", message: "No details found for this user ID" });
  }

  res.status(200).json({ status: "success", data });
});

// Get outpass details by staff ID
export const getOpDetailsByStaffId = asyncHandler(async (req, res) => {
  const { staffId } = req.params;
  const data = await opDetailsModel.find({ staffId });

  if (data.length === 0) {
    return res
      .status(404)
      .json({ status: "error", message: "No details found for this staff ID" });
  }

  res.status(200).json({ status: "success", data });
});

// Assign outpass details to staff
export const AssigntoStaff = asyncHandler(async (req, res) => {
  const { id, staffId } = req.body;
  const data = await opDetailsModel.findOneAndUpdate(
    { _id: id },
    { staffId },
    { new: true }
  );

  if (!data) {
    return res
      .status(404)
      .json({ status: "error", message: "Outpass details not found" });
  }

  res.status(200).json({ status: "success", data });
});

// Accept outpass request
export const acceptRequest = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const data = await opDetailsModel.findOneAndUpdate(
    { _id: id },
    { isAccept: true },
    { new: true }
  );

  if (!data) {
    return res
      .status(404)
      .json({ status: "error", message: "Outpass details not found" });
  }

  res.status(200).json({ status: "success", data });
});

// Reject outpass request
export const rejectRequest = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const data = await opDetailsModel.findOneAndUpdate(
    { _id: id },
    { isAccept: false },
    { new: true }
  );

  if (!data) {
    return res
      .status(404)
      .json({ status: "error", message: "Outpass details not found" });
  }

  res.status(200).json({ status: "success", data });
});

export const verifyOutpassTicket = asyncHandler(async (req, res) => {
  try {
    const outpass = await opDetailsModel.findById(req.params.id);
    if (!outpass) {
      return res
        .status(404)
        .json({ status: "error", message: "Outpass not found" });
    }
    if (outpass?.isScanned === true) {
      return res.status(400).json({
        status: "error",
        message: "Already Scanned",
      });
    }
    const now = new Date();
    const isValid =
      outpass.isAccept &&
      new Date(outpass.dateFrom) <= now &&
      new Date(outpass.dateTo) >= now;

    res.json({
      status: "success",
      data: {
        ...outpass.toObject(),
        isValid,
      },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error });
  }
});
