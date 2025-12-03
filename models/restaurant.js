const db = require('../config/db');

// Fungsi untuk membuat tabel restaurants
async function createRestaurantsTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS restaurants (
                id INT PRIMARY KEY AUTO_INCREMENT,
                slug VARCHAR(255) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                subtitle VARCHAR(255),
                time VARCHAR(100),
                description TEXT,
                address TEXT,
                maps_link VARCHAR(500),
                image VARCHAR(500),
                instagram VARCHAR(255),
                whatsapp VARCHAR(255),
                facebook VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_slug (slug)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await db.query(createTableQuery);
        console.log('✅ Tabel restaurants berhasil dibuat atau sudah ada');
    } catch (error) {
        console.error('❌ Error membuat tabel restaurants:', error.message);
    }
}

// Fungsi untuk membuat tabel restaurant_menu
async function createRestaurantMenuTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS restaurant_menu (
                id INT PRIMARY KEY AUTO_INCREMENT,
                restaurant_id INT NOT NULL,
                item VARCHAR(255) NOT NULL,
                price VARCHAR(100) NOT NULL,
                position ENUM('left', 'right') DEFAULT 'left',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
                INDEX idx_restaurant_id (restaurant_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await db.query(createTableQuery);
        console.log('✅ Tabel restaurant_menu berhasil dibuat atau sudah ada');
    } catch (error) {
        console.error('❌ Error membuat tabel restaurant_menu:', error.message);
    }
}

// Model untuk operasi database Restaurant
class Restaurant {
    
    // Mendapatkan restaurant berdasarkan slug
    static async findBySlug(slug) {
        try {
            const [restaurants] = await db.query(
                `SELECT * FROM restaurants WHERE slug = ? LIMIT 1`,
                [slug]
            );

            if (restaurants.length === 0) {
                return null;
            }

            const restaurant = restaurants[0];

            // Ambil menu untuk restaurant ini
            const [menuItems] = await db.query(
                `SELECT item, price, position FROM restaurant_menu 
                 WHERE restaurant_id = ? 
                 ORDER BY id ASC`,
                [restaurant.id]
            );

            // Format menu menjadi left dan right
            const menu = {
                left: menuItems.filter(item => item.position === 'left')
                    .map(({ item, price }) => ({ item, price })),
                right: menuItems.filter(item => item.position === 'right')
                    .map(({ item, price }) => ({ item, price }))
            };

            // Format socials
            const socials = {
                instagram: restaurant.instagram || null,
                whatsapp: restaurant.whatsapp || null,
                facebook: restaurant.facebook || null
            };

            // Return formatted data
            return {
                id: restaurant.id,
                slug: restaurant.slug,
                title: restaurant.title,
                subtitle: restaurant.subtitle,
                time: restaurant.time,
                description: restaurant.description,
                address: restaurant.address,
                mapsLink: restaurant.maps_link,
                image: restaurant.image,
                socials,
                menu,
                createdAt: restaurant.created_at,
                updatedAt: restaurant.updated_at
            };

        } catch (error) {
            console.error('Error finding restaurant by slug:', error);
            throw error;
        }
    }

    // Mendapatkan semua restaurant
    static async findAll(limit = 20, offset = 0) {
        try {
            const [restaurants] = await db.query(
                `SELECT id, slug, title, subtitle, time, address, image, created_at 
                 FROM restaurants 
                 ORDER BY created_at DESC 
                 LIMIT ? OFFSET ?`,
                [limit, offset]
            );

            // Get total count
            const [countResult] = await db.query(
                `SELECT COUNT(*) as total FROM restaurants`
            );
            
            const total = countResult[0].total;

            return {
                restaurants: restaurants.map(r => ({
                    id: r.id,
                    slug: r.slug,
                    title: r.title,
                    subtitle: r.subtitle,
                    time: r.time,
                    address: r.address,
                    image: r.image,
                    createdAt: r.created_at
                })),
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: (offset + limit) < total
                }
            };

        } catch (error) {
            console.error('Error finding all restaurants:', error);
            throw error;
        }
    }

    // Menambahkan restaurant baru
    static async create(restaurantData) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // Insert restaurant
            const [result] = await connection.query(
                `INSERT INTO restaurants 
                (slug, title, subtitle, time, description, address, maps_link, image, instagram, whatsapp, facebook) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    restaurantData.slug,
                    restaurantData.title,
                    restaurantData.subtitle || null,
                    restaurantData.time || null,
                    restaurantData.description || null,
                    restaurantData.address || null,
                    restaurantData.mapsLink || null,
                    restaurantData.image || null,
                    restaurantData.socials?.instagram || null,
                    restaurantData.socials?.whatsapp || null,
                    restaurantData.socials?.facebook || null
                ]
            );

            const restaurantId = result.insertId;

            // Insert menu items
            if (restaurantData.menu) {
                const menuInserts = [];
                
                // Left menu items
                if (restaurantData.menu.left && restaurantData.menu.left.length > 0) {
                    restaurantData.menu.left.forEach(item => {
                        menuInserts.push([restaurantId, item.item, item.price, 'left']);
                    });
                }
                
                // Right menu items
                if (restaurantData.menu.right && restaurantData.menu.right.length > 0) {
                    restaurantData.menu.right.forEach(item => {
                        menuInserts.push([restaurantId, item.item, item.price, 'right']);
                    });
                }

                if (menuInserts.length > 0) {
                    await connection.query(
                        `INSERT INTO restaurant_menu (restaurant_id, item, price, position) VALUES ?`,
                        [menuInserts]
                    );
                }
            }

            await connection.commit();
            return { id: restaurantId, slug: restaurantData.slug };

        } catch (error) {
            await connection.rollback();
            console.error('Error creating restaurant:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = {
    createRestaurantsTable,
    createRestaurantMenuTable,
    Restaurant
};
