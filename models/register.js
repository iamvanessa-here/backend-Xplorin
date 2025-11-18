const db = require('../config/db');

// Function untuk membuat tabel users jika belum ada
const createUsersTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    try {
        await db.query(createTableQuery);
        console.log('✅ Tabel users sudah siap');
    } catch (error) {
        console.error('❌ Error membuat tabel users:', error.message);
    }
};

// Function untuk insert user baru
const createUser = async (userData) => {
    const { username, email, password, full_name } = userData;
    
    const insertQuery = `
        INSERT INTO users (username, email, password, full_name) 
        VALUES (?, ?, ?, ?)
    `;
    
    try {
        const [result] = await db.query(insertQuery, [username, email, password, full_name]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Function untuk cek apakah email sudah terdaftar
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    try {
        const [rows] = await db.query(query, [email]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Function untuk cek apakah username sudah terdaftar
const findUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    
    try {
        const [rows] = await db.query(query, [username]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUsersTable,
    createUser,
    findUserByEmail,
    findUserByUsername
};
