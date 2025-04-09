const express = require("express");
const { addEvent, searchEvents, getEvents, getAvailableSeats } = require("../Controllers/EventController");
const {uploadMultiple} = require("../Middleware/Multer"); 
const router = express.Router();
router.post("/",uploadMultiple,addEvent);       
router.get("/getEvents",searchEvents);
router.get("/allEvents",getEvents);
router.get("/:id/seats",getAvailableSeats)
module.exports = router;
