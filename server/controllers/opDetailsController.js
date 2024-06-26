
const opDetailsModel = require("../models/OutpassDetails");
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
    isAccept: false,
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



exports.acceptRequest = asyncHandler(async (req, res) => {
  try {
    const { rollno } = req.body;
    const data = await opDetailsModel.findOneAndUpdate(
      { rollno: rollno },
      { isAccept: true },
      { new: true } // This option returns the updated document
    );
    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ error: 'An error occurred while processing the request' });
  }
});



exports.rejectRequest = async (req, res) => {
  try {
    const { rollno, val } = req.body;
    const data = await opDetailsModel.findOneAndUpdate(
      { rollno: rollno },
      {isAccept:false},
      { rejectReason: val },
      { new: true } 
    );
    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err.message);
  }
};

