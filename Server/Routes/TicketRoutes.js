const express = require('express');
const { bookTicket, downloadTicket, verifyTicket } = require('../Controllers/ticketController');
const router = express.Router();

router.post('/book', bookTicket);
router.get('/download/:id', downloadTicket);
router.post('/verify', verifyTicket);

module.exports = router;