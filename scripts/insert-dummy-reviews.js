const db = require('./config/db');

const dummyReviews = [
    {
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        review_text: "Amazing platform! I discovered so many authentic Palembang dishes. The pempek recommendations were spot on!",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Ahmad Rizki",
        email: "ahmad.rizki@example.com",
        review_text: "Sangat membantu untuk wisatawan yang ingin mencoba kuliner Palembang. Interface-nya user friendly!",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Lisa Chen",
        email: "lisa.chen@example.com",
        review_text: "Great resource for food lovers! Found the best tekwan place through this website.",
        rating: 4,
        is_dummy: 1
    },
    {
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
        review_text: "Website yang sangat berguna! Saya menemukan banyak tempat makan tersembunyi yang enak banget.",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Maria Garcia",
        email: "maria.g@example.com",
        review_text: "As a tourist, this made my culinary journey in Palembang so much easier. Highly recommended!",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Dewi Lestari",
        email: "dewi.lestari@example.com",
        review_text: "Informasi kulinernya lengkap dan akurat. Pempek, model, tekwan, semuanya ada!",
        rating: 4,
        is_dummy: 1
    },
    {
        name: "John Smith",
        email: "john.smith@example.com",
        review_text: "Excellent guide to Palembang cuisine. The reviews helped me choose the best restaurants.",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Siti Nurhaliza",
        email: "siti.nur@example.com",
        review_text: "Sebagai orang Palembang, saya bangga ada website seperti ini yang mempromosikan kuliner lokal!",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "David Lee",
        email: "david.lee@example.com",
        review_text: "Very helpful website! The food recommendations are authentic and delicious.",
        rating: 4,
        is_dummy: 1
    },
    {
        name: "Ratna Sari",
        email: "ratna.sari@example.com",
        review_text: "Website yang keren! Memudahkan saya menemukan makanan khas Palembang yang enak.",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Michael Brown",
        email: "michael.b@example.com",
        review_text: "Best culinary guide for Palembang! Every recommendation was worth trying.",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Rina Wijaya",
        email: "rina.wijaya@example.com",
        review_text: "Sangat informatif dan mudah digunakan. Rekomendasi restorannya tepat sasaran!",
        rating: 4,
        is_dummy: 1
    },
    {
        name: "James Wilson",
        email: "james.w@example.com",
        review_text: "Found amazing local dishes I wouldn't have discovered otherwise. Great job!",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Ani Kusuma",
        email: "ani.kusuma@example.com",
        review_text: "Platform yang sangat membantu! Semua kuliner khas Palembang ada di sini.",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Robert Taylor",
        email: "robert.t@example.com",
        review_text: "Incredible resource for food enthusiasts visiting Palembang. Loved every recommendation!",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Lina Marlina",
        email: "lina.marlina@example.com",
        review_text: "Website yang bagus dan informatif. Membantu saya menemukan kuliner Palembang terbaik.",
        rating: 4,
        is_dummy: 1
    },
    {
        name: "Thomas Anderson",
        email: "thomas.a@example.com",
        review_text: "Outstanding platform! Made my food tour in Palembang unforgettable.",
        rating: 5,
        is_dummy: 1
    },
    {
        name: "Yuli Andriani",
        email: "yuli.andriani@example.com",
        review_text: "Sangat recommended! Informasi lengkap tentang kuliner khas Palembang.",
        rating: 5,
        is_dummy: 1
    }
];

const insertDummyReviews = async () => {
    try {
        console.log('🔄 Menambahkan kolom is_dummy ke tabel reviews...');
        
        // Tambahkan kolom is_dummy jika belum ada
        try {
            await db.query(`
                ALTER TABLE reviews 
                ADD COLUMN is_dummy TINYINT(1) DEFAULT 0 AFTER rating
            `);
            console.log('✅ Kolom is_dummy berhasil ditambahkan');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ Kolom is_dummy sudah ada');
            } else {
                throw error;
            }
        }

        console.log('\n🔄 Inserting dummy reviews...');
        
        for (const review of dummyReviews) {
            const insertQuery = `
                INSERT INTO reviews (name, email, review_text, rating, is_dummy) 
                VALUES (?, ?, ?, ?, ?)
            `;
            
            await db.query(insertQuery, [
                review.name,
                review.email,
                review.review_text,
                review.rating,
                review.is_dummy
            ]);
            
            console.log(`✅ Added review from ${review.name}`);
        }

        console.log(`\n🎉 Successfully inserted ${dummyReviews.length} dummy reviews!`);
        
        // Tampilkan statistik
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_reviews,
                SUM(CASE WHEN is_dummy = 1 THEN 1 ELSE 0 END) as dummy_reviews,
                SUM(CASE WHEN is_dummy = 0 THEN 1 ELSE 0 END) as real_reviews,
                AVG(rating) as average_rating
            FROM reviews
        `);
        
        console.log('\n📊 Review Statistics:');
        console.table(stats);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

insertDummyReviews();
