const express = require("express");
const router = express.Router();
const opDetailsController = require("../controllers/opDetailsController");

router.post("/", opDetailsController.createOpDetails);
router.get("/", opDetailsController.getOpDetails);

router.post("/accept", opDetailsController.acceptRequest);

router.post("/reject", opDetailsController.rejectRequest);

module.exports = router;
