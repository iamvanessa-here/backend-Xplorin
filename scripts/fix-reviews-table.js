const db = require('./config/db');

const recreateReviewsTable = async () => {
    try {
        console.log('🔄 Dropping existing reviews table...');
        await db.query('DROP TABLE IF EXISTS reviews');
        console.log('✅ Table dropped');

        console.log('🔄 Creating new reviews table...');
        const createTableQuery = `
            CREATE TABLE reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                review_text TEXT NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_created_at (created_at DESC),
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await db.query(createTableQuery);
        console.log('✅ Reviews table created successfully!');
        
        console.log('\n📋 Table structure:');
        const [rows] = await db.query('DESCRIBE reviews');
        console.table(rows);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

recreateReviewsTable();
