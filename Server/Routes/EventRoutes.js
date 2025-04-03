const express = require("express");
const { addEvent, searchEvents, getEvents } = require("../Controllers/EventController");
const {uploadMultiple} = require("../Middleware/Multer"); 
const router = express.Router();
router.post("/", addEvent);       
router.get("/getEvents",searchEvents);
router.get("/allEvents",getEvents);
module.exports = router;
