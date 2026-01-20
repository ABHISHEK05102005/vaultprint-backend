const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// After payment, frontend calls this to get OTP for a stored file
router.get('/:kioskId/:fileName', otpController.getOtpFromFileName);

module.exports = router;

