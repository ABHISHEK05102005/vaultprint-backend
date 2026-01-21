// Load environment variables
require('dotenv').config();

// Import your Express app logic
const app = require('./serverApp'); 

// Only start the server locally (Vercel ignores this block)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

// Crucial: Export the app for Vercel
module.exports = app;