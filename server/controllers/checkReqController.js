const checkreq = require("../models/ApprovalStatus");

exports.checkReqStatus = async (req, res) => {
  const { rollno } = req.body;
  const data = await checkreq.findOne({
    rollNo: rollno,
  });
  if (data == null) res.send("not");
  else {
    res.send("exists");
  }
};
