const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Special handling for Stripe webhooks (must be before express.json middleware)
app.post('/api/credits/webhook', express.raw({type: 'application/json'}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/keywords', require('./routes/keywords'));
app.use('/api/content', require('./routes/content'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/credits', require('./routes/creditRoutes'));
app.use('/api/referral', require('./routes/referralRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message 
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
