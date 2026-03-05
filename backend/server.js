const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/artworks', require('./routes/artworkRoutes'));

app.get('/', (req, res) => {
    res.send('InspireCanvas API is running');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Error Handling Middleware
app.use((err, req, res, next) => {
    // Scrub sensitive info from message before logging to terminal
    let logMessage = err.message || 'Unknown Error';
    if (logMessage.includes('api_key') || logMessage.includes('cloud_name') || logMessage.includes('api_secret')) {
        logMessage = 'External service configuration error (Sensitive details hidden)';
    }

    console.error(`Status ${err.status || 500}: ${logMessage}`);

    // Determine a descriptive but safe message for the client
    let safeMessage = 'An internal error occurred. Please try again later.';
    const errMsg = (err.message || '').toLowerCase();

    if (err.status && err.status < 500) {
        safeMessage = err.message; // Client errors (4xx) are generally safe
    } else if (errMsg.includes('api_key')) {
        safeMessage = 'Invalid Cloudinary API Key. Please check your .env configuration.';
    } else if (errMsg.includes('cloud_name')) {
        safeMessage = 'Invalid Cloudinary Cloud Name. Please check your .env configuration.';
    } else if (errMsg.includes('secret')) {
        safeMessage = 'Invalid Cloudinary API Secret. Please check your .env configuration.';
    }

    res.status(err.status || 500).json({
        message: safeMessage
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
