const express = require('express');
const router = express.Router();
const kioskController = require('../controllers/kioskController');

// Kiosk sends OTP to fetch and print
router.post('/print', kioskController.handlePrintRequest);

module.exports = router;

