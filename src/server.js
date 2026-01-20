// Load environment variables from .env file
require('dotenv').config();

const app = require('./serverApp');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Kiosk print backend running on port ${PORT}`);
});

