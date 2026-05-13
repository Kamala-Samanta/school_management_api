const express = require("express");
const router = express.Router();

const {
  addSchool,
  listSchools,
} = require("../controllers/schoolController.js");

router.post("/schools", addSchool);
router.get("/schools", listSchools);
module.exports = router;
