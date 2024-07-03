const opDetailsModel = require("../models/OutpassDetails");
const { asyncHandler } = require("../handlers/errorHandlers");

exports.createOpDetails = asyncHandler(async (req, res) => {
  try {
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
    });
    if (!opFormDetails) {
      throw new Error("Failed to create opFormDetails");
    }
    return res.status(200).json({ data: opFormDetails, status: "success" });
  } catch (error) {
    return res.status(405).send({ status: "error", error: err.message });
  }
});

exports.getOpDetails = asyncHandler(async (req, res) => {
  try {
    const data = await opDetailsModel.find();
    return res.status(200).send({ data: data });
  } catch (err) {
    return res.status(405).send({ status: "error", error: err.message });
  }
});

exports.getOpDetailsByUserId = asyncHandler(async (req, res) => {
  try {
    const userId = req.params;
    const data = await opDetailsModel.find(userId);
    return res.status(200).send({ status: "success", data: data });
  } catch (err) {
    return res.status(405).send({ status: "error", error: err.message });
  }
});

exports.getOpDetailsByStaffId = asyncHandler(async (req, res) => {
  try {
    const staffId = req.params;
    const data = await opDetailsModel.find(staffId);
    return res.status(200).send({ status: "success", data: data });
  } catch (err) {
    return res.status(405).send({ status: "error", error: err.message });
  }
});

exports.AssigntoStaff = asyncHandler(async (req, res) => {
  try {
    const { id, staffId } = req.body;
    const data = await opDetailsModel.findOneAndUpdate(
      { _id: id },
      { staffId: staffId },
      { new: true }
    );
    return res.status(200).send({ status: "success", data: data });
  } catch (err) {
    return res.status(405).send({ status: "error", error: err.message });
  }
});

exports.acceptRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const data = await opDetailsModel.findOneAndUpdate(
      { _id: id },
      { isAccept: true },
      { new: true }
    );
    return res.status(200).send({ status: "success", data: data });
  } catch (err) {
    return res.status(405).send({ status: "error", error: err.message });
  }
});

exports.rejectRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const data = await opDetailsModel.findOneAndUpdate(
      { _id: id },
      { isAccept: false },
      { new: true }
    );
    return res.status(200).send({ status: "success", data: data });
  } catch (err) {
    return res.status(405).send({ status: "error", error: err.message });
  }
});
