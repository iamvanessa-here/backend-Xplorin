const db = require('../config/db');

// Function untuk mencari user berdasarkan email (untuk login)
const findUserByEmailForLogin = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    try {
        const [rows] = await db.query(query, [email]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Function untuk mencari user berdasarkan username (untuk login)
const findUserByUsernameForLogin = async (username) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    
    try {
        const [rows] = await db.query(query, [username]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Function untuk update last login (opsional)
const updateLastLogin = async (userId) => {
    const query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    try {
        const [result] = await db.query(query, [userId]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Function untuk mendapatkan user by ID
const findUserById = async (userId) => {
    const query = 'SELECT id, username, email, full_name, created_at FROM users WHERE id = ?';
    
    try {
        const [rows] = await db.query(query, [userId]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findUserByEmailForLogin,
    findUserByUsernameForLogin,
    updateLastLogin,
    findUserById
};
