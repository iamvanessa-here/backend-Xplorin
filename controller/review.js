const { 
    createReview, 
    getLatestReviews,
    getReviewsForCarousel, 
    getAverageRating,
    getAllReviews 
} = require('../models/review');

// Controller untuk menambahkan review baru
const addReview = async (req, res) => {
    try {
        const { name, email, review_text, rating } = req.body;

        // Validasi input
        if (!name || !email || !review_text || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi (name, email, review_text, rating)'
            });
        }

        // Validasi rating (1-5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating harus antara 1 sampai 5'
            });
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }

        // Simpan review ke database
        const result = await createReview({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            review_text: review_text.trim(),
            rating: parseInt(rating)
        });

        // Ambil review yang baru saja dibuat
        const [latestReviews] = await getLatestReviews(1);

        res.status(201).json({
            success: true,
            message: 'Review berhasil ditambahkan',
            data: {
                id: result.insertId,
                review: latestReviews
            }
        });

    } catch (error) {
        console.error('Error di addReview controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menambahkan review',
            error: error.message
        });
    }
};

// Controller untuk mendapatkan user reviews (2 review terbaru + average rating)
const getUserReviews = async (req, res) => {
    try {
        // Ambil 2 review terbaru
        const latestReviews = await getLatestReviews(2);

        // Hitung average rating dari semua review
        const ratingData = await getAverageRating();

        res.status(200).json({
            success: true,
            message: 'Data review berhasil diambil',
            data: {
                reviews: latestReviews,
                average_rating: parseFloat(ratingData.average_rating).toFixed(1),
                total_reviews: ratingData.total_reviews
            }
        });

    } catch (error) {
        console.error('Error di getUserReviews controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data review',
            error: error.message
        });
    }
};

// Controller untuk mendapatkan reviews untuk carousel (20 reviews untuk 2 baris)
const getCarouselReviews = async (req, res) => {
    try {
        // Ambil 20 review (10 baris atas, 10 baris bawah)
        const reviewsData = await getReviewsForCarousel();

        // Hitung average rating dari semua review
        const ratingData = await getAverageRating();

        res.status(200).json({
            success: true,
            message: 'Data carousel reviews berhasil diambil',
            data: {
                topLine: reviewsData.topLine,
                bottomLine: reviewsData.bottomLine,
                average_rating: parseFloat(ratingData.average_rating).toFixed(1),
                total_reviews: ratingData.total_reviews
            }
        });

    } catch (error) {
        console.error('Error di getCarouselReviews controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data carousel reviews',
            error: error.message
        });
    }
};

// Controller untuk mendapatkan semua reviews (opsional untuk admin)
const getAllReviewsController = async (req, res) => {
    try {
        const reviews = await getAllReviews();
        const ratingData = await getAverageRating();

        res.status(200).json({
            success: true,
            message: 'Semua review berhasil diambil',
            data: {
                reviews: reviews,
                average_rating: parseFloat(ratingData.average_rating).toFixed(1),
                total_reviews: ratingData.total_reviews
            }
        });

    } catch (error) {
        console.error('Error di getAllReviewsController:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil semua review',
            error: error.message
        });
    }
};

module.exports = {
    addReview,
    getUserReviews,
    getCarouselReviews,
    getAllReviewsController
};
