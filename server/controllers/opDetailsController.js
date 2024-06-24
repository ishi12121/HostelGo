const jwt = require("jsonwebtoken");
const opDetailsModel = require("../models/OutpassDetails");
const checkreq = require("../models/ApprovalStatus");

exports.createOpDetails = async (req, res) => {
  try {
    const { data } = req.body;
    const decode = jwt.verify(req.cookies.siva, "1234");

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
      qrurl: data.qrurl,
      parentPhNo: data.parentPhNo,
      reason: data.reason,
      city: data.city,
    });

    if (opFormDetails) {
      try {
        const val = await checkreq.create({ rollNo: decode.email });
        if (val) {
          return res.status(200).send({ data: opFormDetails, status: "no err" });
        }
      } catch (e) {
        console.log(e);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

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
