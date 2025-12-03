const db = require('./config/db');

// Script untuk menambahkan kolom-kolom baru ke tabel users yang sudah ada
const updateUsersTable = async () => {
    console.log('🔧 Memulai update tabel users...\n');

    const columnsToAdd = [
        { name: 'profile_picture', definition: 'TEXT DEFAULT NULL' },
        { name: 'date_of_birth', definition: 'DATE DEFAULT NULL' },
        { name: 'phone_number', definition: 'VARCHAR(20) DEFAULT NULL' },
        { name: 'country', definition: 'VARCHAR(100) DEFAULT NULL' },
        { name: 'city', definition: 'VARCHAR(100) DEFAULT NULL' },
        { name: 'postal_code', definition: 'VARCHAR(20) DEFAULT NULL' },
        { name: 'location', definition: 'VARCHAR(255) DEFAULT NULL' }
    ];

    try {
        for (const column of columnsToAdd) {
            try {
                // Cek apakah kolom sudah ada
                const [columns] = await db.query(
                    `SHOW COLUMNS FROM users LIKE '${column.name}'`
                );

                if (columns.length === 0) {
                    // Kolom belum ada, tambahkan
                    await db.query(
                        `ALTER TABLE users ADD COLUMN ${column.name} ${column.definition}`
                    );
                    console.log(`✅ Kolom '${column.name}' berhasil ditambahkan`);
                } else {
                    console.log(`⏭️  Kolom '${column.name}' sudah ada, skip`);
                }
            } catch (error) {
                console.error(`❌ Error menambahkan kolom '${column.name}':`, error.message);
            }
        }

        console.log('\n🎉 Update tabel users selesai!');
        console.log('\n📋 Struktur tabel users saat ini:');
        
        const [tableStructure] = await db.query('DESCRIBE users');
        console.table(tableStructure);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
};

updateUsersTable();
