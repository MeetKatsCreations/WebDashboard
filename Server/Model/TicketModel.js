const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
  userName: String,
  eventName: String,
  timing: String,
  qrCode: String,
});
module.exports = mongoose.model('Ticket', TicketSchema);