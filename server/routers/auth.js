const express = require("express");
const router = express.Router();

const login = require("../validation/login");

router.post("/student", login.studentlog);
router.post("/staff", login.stafflog);

router.get("/cookdata", login.cookdata);
router.delete("/logout", login.logout);

module.exports = router;
