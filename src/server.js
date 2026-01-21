require('dotenv').config();
const app = require('./serverApp'); 

// Root route to prevent 404
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is active!",
        status: "success",
        timestamp: new Date().toISOString()
    });
});

// Local Development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;