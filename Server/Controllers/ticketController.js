const Ticket = require('../Model/TicketModel');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');

bookTicket = async (req, res) => {
  const { userName, eventName, timing } = req.body;
  const ticketData = `${userName} | ${eventName} | ${timing}`;
  const qrCode = await QRCode.toDataURL(ticketData);
  const newTicket = new Ticket({ userName, eventName, timing, qrCode });
  await newTicket.save();
  res.json({ message: 'Ticket Booked!', qrCode, ticketId: newTicket._id });
};

downloadTicket = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  
    const dir = './tickets';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); 
    }
  
    const doc = new PDFDocument();
    const fileName = `ticket-${ticket._id}.pdf`;
    const filePath = `${dir}/${fileName}`;
  
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text(`Ticket for ${ticket.eventName}`, { align: 'center' });
    doc.text(`Name: ${ticket.userName}`);
    doc.text(`Timing: ${ticket.timing}`);
    doc.image(ticket.qrCode, { width: 150, height: 150 });
    doc.end();
  
    doc.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) console.error('Error sending file:', err);
      });
    });
  };

verifyTicket = async (req, res) => {
  const { qrCode } = req.body;
  const ticket = await Ticket.findOne({ qrCode });
  if (!ticket) return res.status(400).json({ message: 'Invalid Ticket' });
  res.json({ message: 'Valid Ticket', ticket });
};
module.exports={downloadTicket,bookTicket,verifyTicket}