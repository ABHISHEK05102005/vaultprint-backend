const multer = require('multer');

// Store in memory; storageService will persist to disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB
  }
});

module.exports = upload;

