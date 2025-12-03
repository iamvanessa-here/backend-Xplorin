const express = require('express');
const router = express.Router();
const { 
    addReview, 
    getUserReviews,
    getCarouselReviews,
    getAllReviewsController 
} = require('../controller/review');

// Route untuk menambahkan review baru (POST)
// Body: { name, email, review_text, rating }
router.post('/add', addReview);

// Route untuk mendapatkan 2 review terbaru + average rating (GET)
router.get('/user-reviews', getUserReviews);

// Route untuk mendapatkan 20 reviews untuk carousel (10 atas, 10 bawah)
router.get('/carousel', getCarouselReviews);

// Route untuk mendapatkan semua reviews (opsional, untuk admin)
router.get('/all', getAllReviewsController);

module.exports = router;
