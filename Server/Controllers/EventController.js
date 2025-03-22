const Event = require("../Model/eventModel");
const addEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      dateTime,
      duration,
      location,
      organizer,
      price,
      capacity,
      tags
    } = req.body;

    if (
      !title || !category || !description || !dateTime || !location || !organizer ||
      tags === undefined || !Array.isArray(tags) || tags.length === 0 || 
      capacity === undefined || price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Fill all required fields!",
      });
    }

    if (!duration || typeof duration.hours !== "number" || typeof duration.minutes !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid duration. Please provide hours and minutes as numbers.",
      });
    }
    if ( tags.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tags must be  non-empty ",
      });
    }
    if (duration.hours < 0 || duration.minutes < 0 || duration.minutes > 59) {
      return res.status(400).json({
        success: false,
        message: "Duration must be valid. Hours cannot be negative and minutes must be between 0-59.",
      });
    }

    const eventDate = new Date(dateTime);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Please provide a valid dateTime.",
      });
    }
    if (eventDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Event date cannot be in the past.",
      });
    }

    if (!location.type || !["Virtual", "Physical"].includes(location.type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location type. Must be either 'Virtual' or 'Physical'.",
      });
    }
    if (location.type === "Physical" && !location.address) {
      return res.status(400).json({
        success: false,
        message: "Address is required for physical events.",
      });
    }
    if (location.type === "Virtual" && !location.link) {
      return res.status(400).json({
        success: false,
        message: "Event link is required for virtual events.",
      });
    }

    if (!organizer.name || !organizer.contactEmail) {
      return res.status(400).json({
        success: false,
        message: "Organizer name and contact email are required.",
      });
    }
    if (!/^\S+@\S+\.\S+$/.test(organizer.contactEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format for organizer.",
      });
    }
    if (organizer.contactPhone && !/^\d{10}$/.test(organizer.contactPhone)) {
      return res.status(400).json({
        success: false,
        message: "Organizer phone number must be exactly 10 digits.",
      });
    }

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number.",
      });
    }
    if (capacity !== undefined && (typeof capacity !== "number" || capacity < 0)) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a positive number.",
      });
    }
    const event = new Event(req.body);
    await event.save();

    res.status(201).json({ success: true, message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

const searchEvents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required." });
    }

    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    if (events.length === 0) {
      return res.status(404).json({ success: false, message: "No matching events found." });
    }

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};


module.exports = { addEvent,searchEvents };