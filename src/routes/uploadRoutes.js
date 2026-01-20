const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// User uploads PDF and customization; kioskId comes from QR / client (in form-data field kioskId)
router.post('/', uploadMiddleware.single('file'), uploadController.handleUpload);

// Back-compat: kioskId in URL
router.post('/:kioskId', uploadMiddleware.single('file'), uploadController.handleUpload);

module.exports = router;

