const crypto = require('crypto');

// In a real system this should come from environment variables
const SERVER_KEY = process.env.SERVER_KEY || 'CHANGE_ME_SERVER_KEY';

exports.generateOtp = () => {
  // 6-digit numeric OTP
  return ('' + Math.floor(100000 + Math.random() * 900000));
};

exports.validateServerKey = (key) => {
  return key && key === SERVER_KEY;
};

