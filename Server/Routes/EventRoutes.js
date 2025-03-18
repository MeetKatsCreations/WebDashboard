const express = require("express");
const { addEvent } = require("../Controllers/EventController");

const router = express.Router();
router.post("/", addEvent);       
module.exports = router;
