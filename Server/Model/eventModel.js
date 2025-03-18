const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Technology", "Business", "Health", "Education", "Entertainment", "Other"],
  },
  description: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  duration: {
    hours: {
      type: Number,
      default: 0,
      min: [0, "Hours cannot be negative"],
    },
    minutes: {
      type: Number,
      default: 0,
      min: [0, "Minutes cannot be negative"],
      max: [59, "Minutes must be less than 60"],
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
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
  },
  price: {
    type: Number,
    default: 0,
    min: [0, "Price cannot be negative"],
  },
  currency: {
    type: String,
    default: "INR",
  },
  capacity: {
    type: Number,
    default: 0,
    min: [0, "Capacity cannot be negative"],
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
    default: "Upcoming",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
