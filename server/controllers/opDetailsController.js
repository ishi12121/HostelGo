const jwt = require("jsonwebtoken");
const opDetailsModel = require("../models/OutpassDetails");
const checkreq = require("../models/ApprovalStatus");
const { asyncHandler } = require("../handlers/errorHandlers");

exports.createOpDetails = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const opFormDetails = await opDetailsModel.create({
    name: data.name,
    department: data.department,
    rollno: data.rollno,
    year: data.year,
    dateFrom: data.dateFrom,
    dateTo: data.dateTo,
    timeFrom: data.timeFrom,
    timeTo: data.timeTo,
    phNo: data.phNo,
    parentPhNo: data.parentPhNo,
    reason: data.reason,
    city: data.city,
    staffId: data.staffId,
  });

  if (!opFormDetails) {
    throw new Error("Failed to create opFormDetails");
  }

  return res.status(200).json({ data: opFormDetails, status: "success" });
});



exports.getOpDetails = async (req, res) => {
  try {
    const data = await opDetailsModel.find();
    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err.message);
  }
};


exports.getOpDetailsById = async (req, res) => {
  try {
    const { rollno } = req.body;
    const data = await opDetailsModel.findOne({ rollno: rollno });
    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err.message);
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { rollno } = req.body;
    const data = await opDetailsModel.findOneAndUpdate(
      { rollno: rollno },
      { isAccept: true }
    );
    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err.message);
  }
};

exports.removeRequest = async (req, res) => {
  try {
    const { rollno } = req.body;
    const data = await opDetailsModel.findOneAndUpdate(
      { rollno: rollno },
      { isWait: false }
    );
    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err.message);
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { rollno, val } = req.body;
    const data = await opDetailsModel.findOneAndUpdate(
      { rollno: rollno },
      { rejectReason: val }
    );
    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err.message);
  }
};

exports.deleteAllRequests = async (req, res) => {
  try {
    const data = await opDetailsModel.deleteMany({ name: { $exists: true } });
    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err.message);
  }
};

exports.deleteRequest = async (req, res) => {
  const id = req.body.id;
  try {
    const decode = jwt.verify(req.cookies.siva, "1234");
    const val = await opDetailsModel.findByIdAndDelete({ _id: id });
    if (val) {
      const ele = await checkreq.findOneAndDelete({ rollNo: decode.email });
      return res.status(200).send({ msg: "removed" });
    }
  } catch (e) {
    return res.status(400).send({ msg: e.message });
  }
};
