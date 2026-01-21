const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const uploadRoutes = require('./routes/uploadRoutes');
const otpRoutes = require('./routes/otpRoutes');
const kioskRoutes = require('./routes/kioskRoutes');

// Exported app so it can be reused by both server.js and Lambda handler
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://vaultprint.vercel.app",
  "https://vaultprint-backend.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// IMPORTANT for preflight
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/kiosk', kioskRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'kiosk-print-backend' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

