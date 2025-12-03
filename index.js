const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const db = require('./config/db');

// Import model untuk membuat tabel
const { createUsersTable } = require('./models/register');
const { createReviewsTable } = require('./models/review');
const { createRestaurantsTable, createRestaurantMenuTable } = require('./models/restaurant');

// Import routes
const authRoutes = require('./routes/authRoute');
const reviewRoutes = require('./routes/reviewRoute');
const restaurantRoutes = require('./routes/restaurantRoute');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON request body with increased limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded request body

// Initialize database table
createUsersTable();
createReviewsTable();
createRestaurantsTable();
createRestaurantMenuTable();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', restaurantRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend API Server is running!',
        endpoints: {
            // Auth endpoints
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/profile (requires token)',
            updateProfile: 'PUT /api/auth/profile (requires token)',
            test: 'GET /api/auth/test',
            // Review endpoints
            addReview: 'POST /api/reviews/add',
            getUserReviews: 'GET /api/reviews/user-reviews',
            getCarouselReviews: 'GET /api/reviews/carousel',
            getAllReviews: 'GET /api/reviews/all',
            // Restaurant endpoints
            getAllRestaurants: 'GET /api/restaurants',
            getRestaurantBySlug: 'GET /api/restaurants/:slug',
            createRestaurant: 'POST /api/restaurants (requires token)'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan pada server',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50));
    console.log('📌 Available Endpoints:');
    console.log('   AUTH:');
    console.log(`   POST   http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
    console.log(`   GET    http://localhost:${PORT}/api/auth/profile`);
    console.log(`   PUT    http://localhost:${PORT}/api/auth/profile`);
    console.log(`   GET    http://localhost:${PORT}/api/auth/test`);
    console.log('   REVIEWS:');
    console.log(`   POST   http://localhost:${PORT}/api/reviews/add`);
    console.log(`   GET    http://localhost:${PORT}/api/reviews/user-reviews`);
    console.log(`   GET    http://localhost:${PORT}/api/reviews/carousel`);
    console.log(`   GET    http://localhost:${PORT}/api/reviews/all`);
    console.log('   RESTAURANTS:');
    console.log(`   GET    http://localhost:${PORT}/api/restaurants`);
    console.log(`   GET    http://localhost:${PORT}/api/restaurants/:slug`);
    console.log(`   POST   http://localhost:${PORT}/api/restaurants`);
    console.log('='.repeat(50));
});
