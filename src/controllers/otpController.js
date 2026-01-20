const path = require('path');

// For now we treat fileName as kioskNumber_otp.pdf and extract OTP
exports.getOtpFromFileName = (req, res) => {
  const { kioskId, fileName } = req.params;

  if (!fileName) {
    return res.status(400).json({ error: 'fileName is required' });
  }

  const baseName = path.basename(fileName, path.extname(fileName)); // kiosk_OTP
  const parts = baseName.split('_');

  if (parts.length < 2) {
    return res.status(400).json({ error: 'Invalid file name format' });
  }

  const fileKioskId = parts[0];
  const otp = parts.slice(1).join('_');

  if (fileKioskId !== kioskId) {
    return res.status(400).json({ error: 'Kiosk ID does not match file' });
  }

  res.json({ kioskId, otp });
};

