const Ticket = require('../Model/TicketModel');
const Event = require("../Model/eventModel");
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose = require("mongoose")
const bookTicket = async (req, res) => {
  const { userName, eventId, timing, startTime } = req.body;

  console.log("Looking for event with ID:", eventId);
  const event = await Event.findById(eventId);
  console.log("Event found:", event);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.bookedSeats >= event.capacity) {
    return res.status(400).json({ message: "No seats available" });
  }

  const ticketData = `${userName} | ${event.title} | ${timing} | ${startTime}`;
  const qrCode = await QRCode.toDataURL(ticketData);

  const newTicket = new Ticket({
    userName,
    eventName: event.title,
    timing,
    qrCode,
    startTime
  });
  await newTicket.save();

  event.bookedSeats += 1;
  await event.save();

  res.json({
    message: "Ticket Booked!",
    qrCode,
    ticketId: newTicket._id,
    remainingSeats: event.capacity - event.bookedSeats,
  });
};


const downloadTicket = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Ticket ID" });
  }


  const ticket = await Ticket.findById(id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  console.log(ticket);

  const fileName = `ticket-${ticket._id}.pdf`;
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', 'application/pdf');

  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(20).text(`Ticket for ${ticket.eventName}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${ticket.userName}`);
  const formattedDateTime = new Date(ticket.timing).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  
  doc.text(`Time: ${formattedDateTime}`);

  doc.moveDown();

  doc.image(ticket.qrCode, { width: 150, height: 150 });

  doc.end();
};

verifyTicket = async (req, res) => {
  const { qrCode } = req.body;
  const ticket = await Ticket.findOne({ qrCode });
  if (!ticket) return res.status(400).json({ message: 'Invalid Ticket' });
  res.json({ message: 'Valid Ticket', ticket });
};
module.exports = { downloadTicket, bookTicket, verifyTicket }