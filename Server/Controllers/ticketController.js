const Ticket = require('../Model/TicketModel');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose= require("mongoose")
bookTicket = async (req, res) => {
  const { userName, eventName, timing } = req.body;
  const ticketData = `${userName} | ${eventName} | ${timing}`;
  const qrCode = await QRCode.toDataURL(ticketData);
  const newTicket = new Ticket({ userName, eventName, timing, qrCode });
  await newTicket.save();
  res.json({ message: 'Ticket Booked!', qrCode, ticketId: newTicket._id });
};


  const downloadTicket = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Ticket ID" });
    }
  
    
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  
    const fileName = `ticket-${ticket._id}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
  
    const doc = new PDFDocument();
    doc.pipe(res);
  
    doc.fontSize(20).text(`Ticket for ${ticket.eventName}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${ticket.userName}`);
    doc.text(`Timing: ${ticket.timing}`);
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
module.exports={downloadTicket,bookTicket,verifyTicket}