const db = require('./config/db');
require('dotenv').config();

// Data restaurants berdasarkan RestaurantData.jsx
const restaurantsData = [
    {
        slug: 'pempek-flamboyant',
        title: 'PEMPEK FLAMBOYANT',
        subtitle: 'Authentic Palembang Fish Cakes',
        time: '06:00 - 21:00',
        description: 'Pempek Flamboyant serves freshly made Palembang fish cakes with authentic flavors that have stood the test of time. From lenjer to kapal selam, each piece is soft, flavorful, and perfectly paired with their signature tangy-sweet vinegar sauce.',
        address: 'Jl. Brigjen Hasan Kasim No.1516, Bukit Sangkal, Kec. Kalidoni, Kota Palembang, Sumatera Selatan 30163',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_Flamboyant.png',
        socials: {
            instagram: 'https://instagram.com/pempekflamboyant',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/pempekflamboyant'
        },
        menu: {
            left: [
                { item: 'Kapal Selam', price: 'Rp 20.000' },
                { item: 'Lenjer Besar', price: 'Rp 20.000' },
                { item: 'Telor Kecil', price: 'Rp 5.000' },
                { item: 'Adaan', price: 'Rp 5.000' },
                { item: 'Kulit', price: 'Rp 5.000' },
                { item: 'Keriting', price: 'Rp 5.000' }
            ],
            right: [
                { item: 'Lempang', price: 'Rp 20.000' },
                { item: 'Tekwan', price: 'Rp 20.000' },
                { item: 'Pindang', price: 'Rp 5.000' },
                { item: 'Kemplang', price: 'Rp 18.000' },
                { item: 'Nasi Putih', price: 'Rp 5.000' },
                { item: 'Es Kacang Merah', price: 'Rp 12.000' }
            ]
        }
    },
    {
        slug: 'toko-harum',
        title: 'TOKO HARUM',
        subtitle: 'Traditional Palembang Bakery',
        time: '06:00 - 21:00',
        description: 'Toko Harum is a long-standing local bakery offering various traditional cakes and Palembang snacks. Perfect for gifts or afternoon tea, each product is made with quality ingredients and a touch of nostalgia.',
        address: 'Jl. Merdeka No.811, Talang Semut, Kec. Bukit Kecil, Kota Palembang, Sumatera Selatan 30135',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_Harum.png',
        socials: {
            instagram: 'https://instagram.com/tokoharum',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/tokoharum'
        },
        menu: {
            left: [
                { item: 'Maksuba, Engkak', price: 'Rp 70.000' },
                { item: 'Kue 8 Jam', price: 'Rp 70.000' },
                { item: 'Kue Durian', price: 'Rp 35.000' },
                { item: 'Gulo Puan', price: 'Rp 20.000' },
                { item: 'Ketan Durian', price: 'Rp 17.000' },
                { item: 'Kue Gandus', price: 'Rp 5.000' }
            ],
            right: [
                { item: 'Es Sugu', price: 'Rp 17.000' },
                { item: 'Kopi Saring', price: 'Rp 10.000' },
                { item: 'Kopi Susu', price: 'Rp 10.000' },
                { item: 'Es Kacang Merah', price: 'Rp 17.000' },
                { item: 'Es Jeruk', price: 'Rp 8.000' },
                { item: 'Es Kopi Susu', price: 'Rp 12.000' }
            ]
        }
    },
    {
        slug: 'kampung-pempek',
        title: 'KAMPUNG PEMPEK',
        subtitle: 'Traditional Pempek Experience',
        time: '06:00 - 21:00',
        description: 'Kampung Pempek offers a cozy, traditional setting where visitors can enjoy a wide variety of Palembang-style pempek. With its warm atmosphere and freshly made dishes, it\'s a perfect place for families and tourists alike.',
        address: 'Jl. Beringin Janggut, Talang Semut, Kec. Bukit Kecil, Kota Palembang, Sumatera Selatan 30135',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_KampungPempek26Ilir.png',
        socials: {
            instagram: 'https://instagram.com/kampungpempek',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/kampungpempek'
        },
        menu: {
            left: [
                { item: 'Kapal Selam', price: 'Rp 20.000' },
                { item: 'Lenjer Besar', price: 'Rp 20.000' },
                { item: 'Telor Kecil', price: 'Rp 5.000' },
                { item: 'Adaan', price: 'Rp 5.000' },
                { item: 'Kulit', price: 'Rp 5.000' },
                { item: 'Keriting', price: 'Rp 5.000' }
            ],
            right: [
                { item: 'Lempang', price: 'Rp 20.000' },
                { item: 'Tekwan', price: 'Rp 20.000' },
                { item: 'Pindang', price: 'Rp 5.000' },
                { item: 'Kemplang', price: 'Rp 18.000' },
                { item: 'Nasi Putih', price: 'Rp 5.000' },
                { item: 'Es Kacang Merah', price: 'Rp 12.000' }
            ]
        }
    },
    {
        slug: 'martabak-har',
        title: 'MARTABAK HAR',
        subtitle: 'Since 1940s',
        time: '06:00 - 21:00',
        description: 'A culinary icon of Palembang, Martabak Har has been serving savory egg martabak with rich curry sauce since the 1940s. The perfect blend of crispy dough and flavorful spices makes it a timeless favorite.',
        address: 'Jl. Jend. Sudirman No.597A, 18 Ilir, Kec. Ilir Tim. I, Kota Palembang, Sumatera Selatan 30121',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_MartabakHar.png',
        socials: {
            instagram: 'https://instagram.com/martabakhar',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/martabakhar'
        },
        menu: {
            left: [
                { item: 'Martabak Telor Ayam', price: 'Rp 15.000' },
                { item: 'Martabak Telor Bebek', price: 'Rp 17.000' },
                { item: 'Martabak Spesial', price: 'Rp 35.000' },
                { item: 'Nasi Briyani', price: 'Rp 10.000' },
                { item: 'Malbi', price: 'Rp 15.000' },
                { item: 'Kambing Bumbu Cabe', price: 'Rp 35.000' }
            ],
            right: [
                { item: 'Es Sugu', price: 'Rp 17.000' },
                { item: 'Kopi Saring', price: 'Rp 10.000' },
                { item: 'Kopi Susu', price: 'Rp 10.000' },
                { item: 'Es Kacang Merah', price: 'Rp 17.000' },
                { item: 'Es Jeruk', price: 'Rp 8.000' },
                { item: 'Es Kopi Susu', price: 'Rp 12.000' }
            ]
        }
    },
    {
        slug: 'mega-cakes',
        title: 'MEGA CAKES',
        subtitle: 'Palembang Traditional Cakes',
        time: '08:00 - 18:00',
        description: 'Mega Cakes is Palembang\'s go-to place for layered cakes and sweet pastries. Each creation blends traditional recipes with modern taste, making it a popular choice for gifts and celebrations.',
        address: 'Jl. Suka Bangun ll, Suka Bangun, Kec.Sukarami, Kota Palembang, Sumatera Selatan 30135',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_MegaCakeSukabangun.png',
        socials: {
            instagram: 'https://instagram.com/megacakes',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/megacakes'
        },
        menu: {
            left: [
                { item: 'Maksuba, Engkak', price: 'Rp 70.000' },
                { item: 'Kue 8 Jam', price: 'Rp 70.000' },
                { item: 'Cake Pandan', price: 'Rp 40.000' },
                { item: 'Cake Caramel', price: 'Rp 40.000' },
                { item: 'Cake Marmer', price: 'Rp 35.000' },
                { item: 'Cake Tape', price: 'Rp 35.000' }
            ],
            right: [
                { item: 'Kemplang Panggang', price: 'Rp 15.000' },
                { item: 'Kue Gandus', price: 'Rp 10.000' },
                { item: 'Kue Lumpang', price: 'Rp 10.000' },
                { item: 'Kue Kojo', price: 'Rp 17.000' },
                { item: 'Kue Srikaya', price: 'Rp 8.000' },
                { item: 'Lempok Durian', price: 'Rp 35.000' }
            ]
        }
    },
    {
        slug: 'mie-celor',
        title: 'MIE CELOR 26 ILIR',
        subtitle: 'Authentic Mie Celor',
        time: '06:00 - 21:00',
        description: 'Famous for its creamy coconut milk broth, Mie Celor 26 Ilir offers a comforting noodle dish topped with shrimp and boiled eggs. A delicious, filling meal that captures the warmth of Palembang\'s traditional flavors.',
        address: 'Jl. KH. Ahmad Dahlan No.2, 26 Ilir, Kec. Bukit Kecil, Kota Palembang, Sumatera Selatan 30136',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_MieCelor16Ilir.png',
        socials: {
            instagram: 'https://instagram.com/miecelor26ilir',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/miecelor26ilir'
        },
        menu: {
            left: [
                { item: 'Paket Triple (3 Porsi Mie Celor)', price: 'Rp 20.000' },
                { item: '1 Porsi Mie Celor + 1 Porsi Es Kacang Merah', price: 'Rp 53.000' },
                { item: '2 Porsi Mie Celor + 1 Porsi Laksan', price: 'Rp 92.000' }
            ],
            right: []
        }
    },
    {
        slug: 'pempek-candy',
        title: 'PEMPEK CANDY',
        subtitle: 'Legendary Pempek',
        time: '06:00 - 21:00',
        description: 'A legendary destination for pempek lovers, Pempek Candy combines tradition and quality in every serving. Its soft texture, rich fish flavor, and balanced cuko sauce have made it a true icon of Palembang cuisine.',
        address: 'Jl. Rajawali no 550, Palembang 30114',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_PempekCandy.png',
        socials: {
            instagram: 'https://instagram.com/pempekcandy',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/pempekcandy'
        },
        menu: {
            left: [
                { item: 'Kapal Selam', price: 'Rp 20.000' },
                { item: 'Lenjer Besar', price: 'Rp 20.000' },
                { item: 'Telor Kecil', price: 'Rp 5.000' },
                { item: 'Adaan', price: 'Rp 5.000' },
                { item: 'Kulit', price: 'Rp 5.000' },
                { item: 'Keriting', price: 'Rp 5.000' }
            ],
            right: [
                { item: 'Lempang', price: 'Rp 20.000' },
                { item: 'Tekwan', price: 'Rp 20.000' },
                { item: 'Pindang', price: 'Rp 5.000' },
                { item: 'Kemplang', price: 'Rp 18.000' },
                { item: 'Nasi Goreng', price: 'Rp 14.000' },
                { item: 'Es Kacang Merah', price: 'Rp 12.000' }
            ]
        }
    },
    {
        slug: 'pindang-umak',
        title: 'PINDANG UMAK',
        subtitle: 'Spicy-Sour Fish Soup',
        time: '06:00 - 21:00',
        description: 'Pindang Umak is one of Palembang\'s favorite spots to enjoy the city\'s signature spicy-sour fish soup. Known for its rich broth and variety of fresh fish options, this restaurant offers authentic Palembang comfort food in a relaxed and welcoming setting.',
        address: 'Jl. Brigjen Hasan Kasim No.1516, Bukit Sangkal, Kec. Kalidoni, Kota Palembang, Sumatera Selatan 30163',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_PondokPindangUmak.png',
        socials: {
            instagram: 'https://instagram.com/pindangumak',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/pindangumak'
        },
        menu: {
            left: [
                { item: 'Pindang Udang', price: 'Rp 63.000' },
                { item: 'Pindang Patin', price: 'Rp 43.000' },
                { item: 'Pindang Baung', price: 'Rp 70.000' },
                { item: 'Pindang Gabus/Toman', price: 'Rp 10.000' },
                { item: 'Pindang Salai', price: 'Rp 15.000' },
                { item: 'Pindang Burung Puyuh', price: 'Rp 56.000' }
            ],
            right: [
                { item: 'Pepes Tempoyak Patin', price: 'Rp 45.000' },
                { item: 'Pepes Tempoyak Baung', price: 'Rp 43.000' },
                { item: 'Nasi', price: 'Rp 10.000' },
                { item: 'Ayam Goreng', price: 'Rp 25.000' },
                { item: 'Ikan Goreng', price: 'Rp 30.000' },
                { item: 'Bebek Bakar', price: 'Rp 56.000' }
            ]
        }
    },
    {
        slug: 'river-side',
        title: 'RIVER SIDE',
        subtitle: 'Dining by the Musi River',
        time: '08:00 - 18:00',
        description: 'Located by the Musi River, River Side Restaurant combines scenic views with traditional Palembang cuisine. Guests can enjoy local dishes while admiring the beauty of Ampera Bridge and the calm river breeze.',
        address: 'Komplek Benteng Kuto Besar Jl. Rumah Bari,19 Ilir, Kec. Bukit Kecil, Kota Palembang, Sumatera Selatan 30135',
        mapsLink: 'https://maps.app.goo.gl/example',
        image: '/images/exploreRestaurant_RiverSide.png',
        socials: {
            instagram: 'https://instagram.com/riverside',
            whatsapp: 'https://wa.me/628123456789',
            facebook: 'https://facebook.com/riverside'
        },
        menu: {
            left: [
                { item: 'Pindang Udang Satang', price: 'Rp 105.000' },
                { item: 'Pindang Ikan Baung', price: 'Rp 70.000' },
                { item: 'Pindang Ikan Patin', price: 'Rp 40.000' },
                { item: 'Pindang Iga', price: 'Rp 60.000' },
                { item: 'Brengkes Patin Asam Pedas', price: 'Rp 40.000' },
                { item: 'Brengkes Patin Tempoyak', price: 'Rp 40.000' }
            ],
            right: [
                { item: 'Ikan Seluang Goreng', price: 'Rp 45.000' },
                { item: 'Sambal Goreng Udang', price: 'Rp 20.000' },
                { item: 'Pempek Kapal Selam', price: 'Rp 30.000' },
                { item: 'Lalapan dan Sambal', price: 'Rp 10.000' }
            ]
        }
    }
];

async function insertRestaurants() {
    const connection = await db.getConnection();
    
    try {
        console.log('🚀 Memulai insert data restaurants...\n');

        for (const restaurant of restaurantsData) {
            await connection.beginTransaction();

            try {
                // Insert restaurant
                const [result] = await connection.query(
                    `INSERT INTO restaurants 
                    (slug, title, subtitle, time, description, address, maps_link, image, instagram, whatsapp, facebook) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        restaurant.slug,
                        restaurant.title,
                        restaurant.subtitle,
                        restaurant.time,
                        restaurant.description,
                        restaurant.address,
                        restaurant.mapsLink,
                        restaurant.image,
                        restaurant.socials.instagram,
                        restaurant.socials.whatsapp,
                        restaurant.socials.facebook
                    ]
                );

                const restaurantId = result.insertId;

                // Insert menu items
                const menuInserts = [];
                
                // Left menu
                if (restaurant.menu.left && restaurant.menu.left.length > 0) {
                    restaurant.menu.left.forEach(item => {
                        menuInserts.push([restaurantId, item.item, item.price, 'left']);
                    });
                }
                
                // Right menu
                if (restaurant.menu.right && restaurant.menu.right.length > 0) {
                    restaurant.menu.right.forEach(item => {
                        menuInserts.push([restaurantId, item.item, item.price, 'right']);
                    });
                }

                if (menuInserts.length > 0) {
                    await connection.query(
                        `INSERT INTO restaurant_menu (restaurant_id, item, price, position) VALUES ?`,
                        [menuInserts]
                    );
                }

                await connection.commit();
                console.log(`✅ Berhasil insert: ${restaurant.title} (${restaurant.slug})`);

            } catch (error) {
                await connection.rollback();
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`⚠️  Skip (sudah ada): ${restaurant.title}`);
                } else {
                    throw error;
                }
            }
        }

        console.log('\n🎉 Selesai! Semua data restaurant berhasil diinsert.');
        
    } catch (error) {
        console.error('❌ Error saat insert restaurants:', error);
    } finally {
        connection.release();
        process.exit(0);
    }
}

// Jalankan script
insertRestaurants();
