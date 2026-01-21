// 1. Load environment variables
require('dotenv').config();

// 2. Import your Express app logic
const app = require('./serverApp'); 

// 3. ADD YOUR ROUTES HERE
// This tells the server: "When someone visits the home page, show this message."
app.get('/', (req, res) => {
    res.send("Server is active and online!");
});

// 4. Local Development Listener
// (This code only runs when you are working on your own computer)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

// 5. Crucial: Export the app for Vercel
module.exports = app;