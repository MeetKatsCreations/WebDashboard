const express = require("express");
const { addEvent, getAllEvents, getEventById } = require("../Controllers/EventController");

const router = express.Router();
router.post("/", addEvent);       
module.exports = router;
