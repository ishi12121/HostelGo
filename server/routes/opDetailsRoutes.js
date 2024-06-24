const express = require("express");
const router = express.Router();
const opDetailsController = require("../controllers/opDetailsController");

router.post("/", opDetailsController.createOpDetails);
router.get("/", opDetailsController.getOpDetails);
router.post("/byId", opDetailsController.getOpDetailsById);
router.post("/accept", opDetailsController.acceptRequest);
router.post("/remove", opDetailsController.removeRequest);
router.post("/reject", opDetailsController.rejectRequest);
router.delete("/deleteAll", opDetailsController.deleteAllRequests);
router.post("/delete", opDetailsController.deleteRequest);

module.exports = router;
