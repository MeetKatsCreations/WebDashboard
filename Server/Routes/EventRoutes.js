const express = require("express");
const { addEvent, searchEvents } = require("../Controllers/EventController");

const router = express.Router();
router.post("/", addEvent);       
router.get("/getEvents",searchEvents)
module.exports = router;
