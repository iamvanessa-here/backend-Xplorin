const mysql = require('mysql2');
require('dotenv').config();

// Membuat connection pool untuk MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'auth_system',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Menggunakan promise-based queries
const promisePool = pool.promise();

// Test koneksi database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error koneksi ke database:', err.message);
        return;
    }
    console.log('✅ Berhasil terkoneksi ke MySQL database');
    connection.release();
});

module.exports = promisePool;
