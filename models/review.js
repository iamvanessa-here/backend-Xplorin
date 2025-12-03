const db = require('../config/db');

// Function untuk membuat tabel reviews jika belum ada
const createReviewsTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            review_text TEXT NOT NULL,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            is_dummy TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_created_at (created_at DESC),
            INDEX idx_email (email),
            INDEX idx_is_dummy (is_dummy)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    try {
        await db.query(createTableQuery);
        console.log('✅ Tabel reviews sudah siap');
    } catch (error) {
        console.error('❌ Error membuat tabel reviews:', error.message);
    }
};

// Function untuk insert review baru
const createReview = async (reviewData) => {
    const { name, email, review_text, rating } = reviewData;
    
    const insertQuery = `
        INSERT INTO reviews (name, email, review_text, rating, is_dummy) 
        VALUES (?, ?, ?, ?, 0)
    `;
    
    try {
        const [result] = await db.query(insertQuery, [name, email, review_text, rating]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Function untuk mendapatkan 2 review terbaru
// Prioritas: Review asli (is_dummy=0) dulu, baru dummy reviews
const getLatestReviews = async (limit = 2) => {
    const query = `
        SELECT id, name, email, review_text, rating, is_dummy, created_at 
        FROM reviews 
        ORDER BY is_dummy ASC, created_at DESC 
        LIMIT ?
    `;
    
    try {
        const [rows] = await db.query(query, [limit]);
        return rows;
    } catch (error) {
        throw error;
    }
};

// Function untuk mendapatkan reviews untuk carousel (10 untuk baris atas, 10 untuk baris bawah)
// Review asli (is_dummy=0) akan replace dummy review secara bertahap
const getReviewsForCarousel = async () => {
    const query = `
        SELECT id, name, email, review_text, rating, is_dummy, created_at 
        FROM reviews 
        ORDER BY is_dummy ASC, created_at DESC 
        LIMIT 20
    `;
    
    try {
        const [rows] = await db.query(query);
        
        // Split menjadi 2 grup: 10 untuk baris atas, 10 untuk baris bawah
        const topLineReviews = rows.slice(0, 10);
        const bottomLineReviews = rows.slice(10, 20);
        
        return {
            topLine: topLineReviews,
            bottomLine: bottomLineReviews
        };
    } catch (error) {
        throw error;
    }
};

// Function untuk menghitung rata-rata rating
const getAverageRating = async () => {
    const query = `
        SELECT 
            COALESCE(AVG(rating), 0) as average_rating,
            COUNT(*) as total_reviews
        FROM reviews
    `;
    
    try {
        const [rows] = await db.query(query);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Function untuk mendapatkan semua reviews (opsional, untuk keperluan admin)
const getAllReviews = async () => {
    const query = `
        SELECT id, name, email, review_text, rating, is_dummy, created_at 
        FROM reviews 
        ORDER BY is_dummy ASC, created_at DESC
    `;
    
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createReviewsTable,
    createReview,
    getLatestReviews,
    getReviewsForCarousel,
    getAverageRating,
    getAllReviews
};
