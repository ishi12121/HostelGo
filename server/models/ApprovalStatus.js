const mongoose = require('mongoose');

const approvalStatusSchema = new mongoose.Schema({
  rollNo: String
});

module.exports = mongoose.model('ApprovalStatus', approvalStatusSchema);
