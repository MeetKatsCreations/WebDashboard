const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const eventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    unique: true,
    default: uuidv4, 
  },
  tags: {
    type: [String],
    index: true, 
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Technology", "Business", "Health", "Education"],
  },
  description: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, 
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"]
  },
  duration: {
    hours: {
      type: Number,
      required:true
    },
    minutes: {
      type: Number,
      required:true
    },
  },
  location: {
    type: {
      type: String,
      enum: ["Virtual", "Physical"],
      required: true,
    },
    address: {
      type: String,
      validate: {
        validator: function () {
          return this.type === "Physical" ? !!this.address : true;
        },
        message: "Address is required for physical events.",
      },
    },
    link: {
      type: String,
      validate: {
        validator: function () {
          return this.type === "Virtual" ? !!this.link : true;
        },
        message: "Event link is required for virtual events.",
      },
    },
  },
  organizer: {
    name: { type: String, required: true },
    contactEmail: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    contactPhone: {
      type: String,
      required:true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
  },
  price: {
    type: Number,
    required:true
    
  },
  currency: {
    type: String,
    default: "INR",
  },
  capacity: {
    type: Number,
    required:true
  },
  bookedSeats: {
    type: Number,
    default: 0,
  },
  image: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
