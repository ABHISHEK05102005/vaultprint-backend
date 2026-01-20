const path = require('path');
const storageService = require('../services/storageService');
const otpService = require('../services/otpService');

// Handles: upload PDF + customization for a given kiosk
exports.handleUpload = async (req, res, next) => {
  try {
    const kioskId = req.params.kioskId || req.body.kioskId;
    const customization = req.body; // pages, color, etc.

    if (!kioskId) {
      return res.status(400).json({ error: 'kioskId is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    // Generate OTP and target filename
    const otp = otpService.generateOtp();
    const ext = path.extname(req.file.originalname) || '.pdf';
    const storedFileName = `${kioskId}_${otp}${ext}`;

    // Save file and metadata under kiosk folder
    await storageService.saveKioskJob({
      kioskId,
      fileBuffer: req.file.buffer,
      fileName: storedFileName,
      customization,
      otp
    });

    // Return OTP so client can display it immediately after upload (per your request)
    res.status(201).json({
      message: 'Upload successful, awaiting payment',
      kioskId,
      storedFileName,
      otp
    });
  } catch (err) {
    next(err);
  }
};

