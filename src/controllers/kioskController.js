const storageService = require('../services/storageService');
const otpService = require('../services/otpService');

// Kiosk sends: { serverKey, kioskId, otp }
exports.handlePrintRequest = async (req, res, next) => {
  try {
    const { serverKey, kioskId, otp } = req.body;

    // Validate server access key
    if (!otpService.validateServerKey(serverKey)) {
      return res.status(401).json({ error: 'Invalid server key' });
    }

    if (!kioskId || !otp) {
      return res.status(400).json({ error: 'kioskId and otp are required' });
    }

    // Find job and validate OTP
    const job = await storageService.getKioskJobByOtp(kioskId, otp);

    if (!job) {
      return res.status(404).json({ error: 'No matching job found' });
    }

    // TODO: Integrate with actual printer API / hardware here
    // For now we just return job details

    // After "printing", clean up files and metadata
    await storageService.deleteKioskJob(job);

    res.json({
      message: 'Print job validated',
      kioskId,
      otp,
      customization: job.customization
    });
  } catch (err) {
    next(err);
  }
};

