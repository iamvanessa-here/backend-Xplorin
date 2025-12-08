-- Drop database jika sudah ada (HATI-HATI di production!)
-- DROP DATABASE IF EXISTS xplorin_db;

CREATE DATABASE IF NOT EXISTS xplorin_db;
USE xplorin_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password dengan bcryptjs',
    full_name VARCHAR(100) DEFAULT NULL,
    phone_number VARCHAR(20) DEFAULT NULL COMMENT 'Phone number with country code',
    date_of_birth DATE DEFAULT NULL COMMENT 'User date of birth',
    country VARCHAR(100) DEFAULT NULL COMMENT 'Country name',
    city VARCHAR(100) DEFAULT NULL COMMENT 'City name',
    postal_code VARCHAR(20) DEFAULT NULL COMMENT 'Postal/ZIP code',
    location VARCHAR(255) DEFAULT NULL COMMENT 'Full location string (City, Country)',
    profile_picture MEDIUMTEXT DEFAULT NULL COMMENT 'Base64 encoded profile picture or URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    phone VARCHAR(20),
    rating DECIMAL(2,1) DEFAULT 0.0 COMMENT 'Rating rata-rata (0.0 - 5.0)',
    total_reviews INT DEFAULT 0 COMMENT 'Jumlah total review',
    image_url VARCHAR(255),
    category VARCHAR(50) DEFAULT 'General' COMMENT 'Kategori restoran',
    price_range VARCHAR(20) DEFAULT '$$' COMMENT '$ = Murah, $$ = Sedang, $$$ = Mahal',
    opening_hours VARCHAR(100) DEFAULT '09:00 - 22:00',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rating (rating),
    INDEX idx_category (category),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: foods
CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'Makanan Utama',
    price DECIMAL(10,2) DEFAULT 0.00,
    image_url VARCHAR(255),
    restaurant_id INT DEFAULT NULL,
    is_signature BOOLEAN DEFAULT FALSE COMMENT 'Menu andalan/signature dish',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_category (category),
    INDEX idx_restaurant (restaurant_id),
    INDEX idx_signature (is_signature)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5) COMMENT 'Rating 1-5 bintang',
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_restaurant (restaurant_id),
    INDEX idx_rating (rating),
    UNIQUE KEY unique_user_restaurant_review (user_id, restaurant_id) COMMENT 'Satu user hanya bisa review 1x per restoran'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data - Users
INSERT INTO users (username, email, password, full_name, phone) VALUES
('admin', 'admin@xplorin.com', '$2a$10$rBV2NdNEPGNqCMnBYqPKTOxJqMQVrLKdNyLbCEV0qQ5WX6iE0L8pS', 'Admin Xplorin', '081234567890'),
('john_doe', 'john@example.com', '$2a$10$rBV2NdNEPGNqCMnBYqPKTOxJqMQVrLKdNyLbCEV0qQ5WX6iE0L8pS', 'John Doe', '081234567891'),
('jane_smith', 'jane@example.com', '$2a$10$rBV2NdNEPGNqCMnBYqPKTOxJqMQVrLKdNyLbCEV0qQ5WX6iE0L8pS', 'Jane Smith', '081234567892'),
('user_palembang', 'user@palembang.com', '$2a$10$rBV2NdNEPGNqCMnBYqPKTOxJqMQVrLKdNyLbCEV0qQ5WX6iE0L8pS', 'Warga Palembang', '081234567893');

-- Sample Data - Restaurants
INSERT INTO restaurants (name, description, location, phone, rating, total_reviews, image_url, category, price_range) VALUES
('Pempek Pak Raden', 'Pempek legendaris Palembang sejak 1980. Terkenal dengan kuah cekonya yang khas dan ikan belida asli.', 'Jl. Sudirman No. 123, Palembang', '0711-123456', 4.8, 150, '/images/restaurants/pempek-pak-raden.jpg', 'Pempek', '$$'),
('Tekwan Aling', 'Tekwan kuah bening dengan bakso ikan yang lembut. Cocok untuk sarapan pagi.', 'Jl. Kapten A. Rivai No. 45, Palembang', '0711-234567', 4.6, 98, '/images/restaurants/tekwan-aling.jpg', 'Tekwan', '$'),
('Model Gangan Cik Umi', 'Model ikan dan gangan yang otentik dengan rasa khas Palembang.', 'Jl. Veteran No. 78, Palembang', '0711-345678', 4.7, 125, '/images/restaurants/model-cik-umi.jpg', 'Model & Gangan', '$$'),
('Pindang Musi', 'Pindang ikan patin dan baung dengan kuah asam pedas yang segar.', 'Jl. Merdeka No. 234, Palembang', '0711-456789', 4.5, 87, '/images/restaurants/pindang-musi.jpg', 'Pindang', '$$'),
('Mie Celor Pak Janggut', 'Mie celor dengan kuah santan gurih dan udang segar.', 'Jl. POM IX No. 67, Palembang', '0711-567890', 4.9, 200, '/images/restaurants/miecelor-janggut.jpg', 'Mie Celor', '$'),
('Martabak HAR', 'Martabak manis dan telur terenak se-Palembang dengan isian melimpah.', 'Jl. R. Sukamto No. 156, Palembang', '0711-678901', 4.7, 165, '/images/restaurants/martabak-har.jpg', 'Martabak', '$$'),
('Laksan 88', 'Laksan kuah santan dengan aroma daun bawang yang harum.', 'Jl. Demang Lebar Daun No. 89, Palembang', '0711-789012', 4.4, 76, '/images/restaurants/laksan-88.jpg', 'Laksan', '$'),
('Celimpungan Sari Rasa', 'Celimpungan ikan dengan bumbu khas Palembang yang pedas gurih.', 'Jl. Kol. Atmo No. 34, Palembang', '0711-890123', 4.6, 92, '/images/restaurants/celimpungan-sari.jpg', 'Celimpungan', '$$'),
('Burgo Akang', 'Burgo kuah santan kental dengan irisan kelapa muda segar.', 'Jl. Rajawali No. 45, Palembang', '0711-901234', 4.5, 81, '/images/restaurants/burgo-akang.jpg', 'Burgo', '$'),
('Kemplang & Kerupuk Basah Melati', 'Aneka kerupuk khas Palembang dengan sambel tauco pedas.', 'Jl. Angkatan 45 No. 123, Palembang', '0711-012345', 4.3, 65, '/images/restaurants/kemplang-melati.jpg', 'Kerupuk', '$');

-- Sample Data - Foods
INSERT INTO foods (name, description, category, price, image_url, restaurant_id, is_signature) VALUES
-- Pempek Pak Raden (Restaurant ID: 1)
('Pempek Kapal Selam', 'Pempek isi telur ayam dengan ukuran besar, disajikan dengan cuko asam manis pedas', 'Pempek', 15000.00, '/images/foods/pempek-kapal-selam.jpg', 1, TRUE),
('Pempek Lenjer', 'Pempek bulat panjang tanpa isi, tekstur kenyal dengan ikan belida asli', 'Pempek', 12000.00, '/images/foods/pempek-lenjer.jpg', 1, FALSE),
('Pempek Adaan', 'Pempek isi ebi dan bawang, rasa gurih dan sedikit pedas', 'Pempek', 10000.00, '/images/foods/pempek-adaan.jpg', 1, FALSE),

-- Tekwan Aling (Restaurant ID: 2)
('Tekwan Special', 'Sup bakso ikan dengan kuah kaldu bening, dilengkapi soun, jamur, dan seledri', 'Tekwan', 18000.00, '/images/foods/tekwan-special.jpg', 2, TRUE),
('Tekwan Biasa', 'Tekwan porsi standar dengan bakso ikan lembut', 'Tekwan', 15000.00, '/images/foods/tekwan-biasa.jpg', 2, FALSE),

-- Model Gangan Cik Umi (Restaurant ID: 3)
('Model Ikan Gabus', 'Ikan gabus berkuah kuning dengan rempah khas Palembang', 'Model', 25000.00, '/images/foods/model-gabus.jpg', 3, TRUE),
('Gangan Ikan Patin', 'Ikan patin berkuah asam pedas dengan nanas dan nangka muda', 'Gangan', 28000.00, '/images/foods/gangan-patin.jpg', 3, TRUE),

-- Pindang Musi (Restaurant ID: 4)
('Pindang Patin', 'Ikan patin dengan kuah asam pedas khas Palembang', 'Pindang', 35000.00, '/images/foods/pindang-patin.jpg', 4, TRUE),
('Pindang Baung', 'Ikan baung kuah asam dengan nanas dan tomat', 'Pindang', 32000.00, '/images/foods/pindang-baung.jpg', 4, FALSE),

-- Mie Celor Pak Janggut (Restaurant ID: 5)
('Mie Celor Udang', 'Mie dengan kuah santan gurih, tauge, telur rebus, dan udang besar', 'Mie Celor', 20000.00, '/images/foods/miecelor-udang.jpg', 5, TRUE),
('Mie Celor Seafood', 'Mie celor dengan topping seafood lengkap: udang, cumi, dan kerang', 'Mie Celor', 25000.00, '/images/foods/miecelor-seafood.jpg', 5, TRUE),

-- Martabak HAR (Restaurant ID: 6)
('Martabak Manis Keju Coklat', 'Martabak manis dengan topping keju dan coklat melimpah', 'Martabak Manis', 45000.00, '/images/foods/martabak-keju-coklat.jpg', 6, TRUE),
('Martabak Telur Special', 'Martabak telur dengan daging cincang dan sayuran', 'Martabak Telur', 38000.00, '/images/foods/martabak-telur.jpg', 6, FALSE),

-- Laksan 88 (Restaurant ID: 7)
('Laksan Spesial', 'Laksan kuah santan dengan soun, tauge, dan ikan', 'Laksan', 16000.00, '/images/foods/laksan-special.jpg', 7, TRUE),

-- Celimpungan Sari Rasa (Restaurant ID: 8)
('Celimpungan Ikan Gabus', 'Ikan gabus dengan bumbu kuning pedas khas celimpungan', 'Celimpungan', 30000.00, '/images/foods/celimpungan-gabus.jpg', 8, TRUE),

-- Burgo Akang (Restaurant ID: 9)
('Burgo Special', 'Burgo kuah santan kental dengan kelapa muda parut', 'Burgo', 12000.00, '/images/foods/burgo-special.jpg', 9, TRUE),

-- Kemplang & Kerupuk Melati (Restaurant ID: 10)
('Kemplang Goreng', 'Kerupuk kemplang goreng renyah dengan sambel tauco', 'Kerupuk', 8000.00, '/images/foods/kemplang-goreng.jpg', 10, FALSE),
('Kerupuk Basah', 'Kerupuk basah dengan kuah cuko khas Palembang', 'Kerupuk', 10000.00, '/images/foods/kerupuk-basah.jpg', 10, TRUE);

-- Sample Data - Reviews
INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES
(2, 1, 5, 'Pempek terenak yang pernah saya coba! Kuah cekonya pas banget, tidak terlalu asam. Pempek kapal selamnya super enak dengan telur yang besar.'),
(3, 1, 5, 'Legendaris memang! Sudah langganan dari kecil. Ikannya asli dan teksturnya kenyal sempurna.'),
(4, 1, 4, 'Enak banget, tapi agak pricey. Worth it sih untuk rasanya yang authentic.'),
(2, 2, 5, 'Tekwan paling enak se-Palembang! Kuahnya bening tapi berasa banget. Bakso ikannya lembut.'),
(3, 2, 4, 'Cocok buat sarapan. Porsinya pas dan harganya terjangkau.'),
(4, 3, 5, 'Gangan ikan patinnya juara! Asam pedasnya bikin ketagihan.'),
(2, 3, 5, 'Model ikan gabusnya recommended! Bumbunya meresap sempurna.'),
(3, 4, 4, 'Pindang patin enak, kuahnya segar. Tempatnya bersih dan nyaman.'),
(4, 4, 5, 'Pindang baung terbaik! Ikannya segar dan bumbunya pas.'),
(2, 5, 5, 'MIE CELOR TERBAIK! Kuah santannya kental dan gurih. Udangnya besar-besar!'),
(3, 5, 5, 'Wajib coba kalau ke Palembang! Porsinya banyak dan rasanya mantap.'),
(4, 5, 5, 'Legendaris! Sudah 30 tahun rasanya tetap konsisten enak.'),
(2, 6, 5, 'Martabak paling enak di Palembang! Kejunya banyak banget.'),
(4, 6, 4, 'Enak tapi harus sabar antri karena selalu rame.'),
(3, 7, 4, 'Laksan enak dengan harga terjangkau. Kuah santannya pas.'),
(4, 7, 5, 'Laksan favorit saya! Sounnya lembut dan kuahnya creamy.'),
(2, 8, 5, 'Celimpungan ikan gabusnya juara! Pedasnya mantap.'),
(3, 8, 4, 'Enak, tapi porsinya agak kecil untuk harganya.'),
(4, 9, 5, 'Burgo terbaik! Kelapa mudanya segar dan kuahnya enak.'),
(2, 10, 4, 'Kerupuk basahnya enak, cuko-nya pas pedasnya.');

-- STORED PROCEDURES (Optional - untuk automation)
DELIMITER //

-- Procedure untuk update rating restaurant berdasarkan reviews
CREATE PROCEDURE UpdateRestaurantRating(IN rest_id INT)
BEGIN
    DECLARE avg_rating DECIMAL(2,1);
    DECLARE review_count INT;
    
    SELECT AVG(rating), COUNT(*) 
    INTO avg_rating, review_count
    FROM reviews 
    WHERE restaurant_id = rest_id;
    
    UPDATE restaurants 
    SET rating = IFNULL(avg_rating, 0.0),
        total_reviews = review_count
    WHERE id = rest_id;
END //

-- Trigger untuk auto-update rating setelah insert review
CREATE TRIGGER after_review_insert 
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    CALL UpdateRestaurantRating(NEW.restaurant_id);
END //

-- Trigger untuk auto-update rating setelah update review
CREATE TRIGGER after_review_update 
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    CALL UpdateRestaurantRating(NEW.restaurant_id);
    IF OLD.restaurant_id != NEW.restaurant_id THEN
        CALL UpdateRestaurantRating(OLD.restaurant_id);
    END IF;
END //

-- Trigger untuk auto-update rating setelah delete review
CREATE TRIGGER after_review_delete 
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    CALL UpdateRestaurantRating(OLD.restaurant_id);
END //

DELIMITER ;

-- Initial data untuk update ratings
CALL UpdateRestaurantRating(1);
CALL UpdateRestaurantRating(2);
CALL UpdateRestaurantRating(3);
CALL UpdateRestaurantRating(4);
CALL UpdateRestaurantRating(5);
CALL UpdateRestaurantRating(6);
CALL UpdateRestaurantRating(7);
CALL UpdateRestaurantRating(8);
CALL UpdateRestaurantRating(9);
CALL UpdateRestaurantRating(10);

-- ============================================
-- USEFUL QUERIES untuk testing
-- ============================================

-- Lihat semua restaurant dengan rating tertinggi
-- SELECT * FROM restaurants ORDER BY rating DESC, total_reviews DESC;

-- Lihat semua review untuk restaurant tertentu
-- SELECT r.*, u.username, u.full_name 
-- FROM reviews r 
-- JOIN users u ON r.user_id = u.id 
-- WHERE r.restaurant_id = 1 
-- ORDER BY r.created_at DESC;

-- Lihat semua menu signature dishes
-- SELECT f.*, r.name as restaurant_name 
-- FROM foods f 
-- JOIN restaurants r ON f.restaurant_id = r.id 
-- WHERE f.is_signature = TRUE;

-- ============================================
-- NOTES untuk DEPLOYMENT di VPS:
-- ============================================
-- 1. Ganti password default di sample users
-- 2. Sesuaikan path image_url dengan struktur folder di VPS
-- 3. Backup database secara berkala
-- 4. Set proper privileges untuk database user
-- 5. Enable slow query log untuk monitoring
-- 6. Sesuaikan timezone jika diperlukan
-- ============================================

-- Success message
SELECT 'Database Xplorin berhasil dibuat!' as status,
       (SELECT COUNT(*) FROM users) as total_users,
       (SELECT COUNT(*) FROM restaurants) as total_restaurants,
       (SELECT COUNT(*) FROM foods) as total_foods,
       (SELECT COUNT(*) FROM reviews) as total_reviews;
