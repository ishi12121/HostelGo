const express = require("express");
const router = express.Router();
const checkReqController = require("../controllers/checkReqController");

router.post("/status", checkReqController.checkReqStatus);

module.exports = router;
