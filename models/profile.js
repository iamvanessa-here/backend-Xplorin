const db = require('../config/db');

/**
 * Find user by ID dengan semua field profile
 * @param {number} userId - ID user yang ingin dicari
 * @returns {Promise<Object|null>} User object atau null jika tidak ditemukan
 */
const findUserById = async (userId) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id, 
                username, 
                email, 
                full_name, 
                phone_number, 
                DATE_FORMAT(date_of_birth, '%Y-%m-%d') as date_of_birth,
                country,
                city,
                postal_code,
                location,
                profile_picture,
                created_at,
                updated_at
            FROM users 
            WHERE id = ?`,
            [userId]
        );
        
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error di findUserById:', error);
        throw error;
    }
};

/**
 * Check if username is available (excluding current user)
 * @param {string} username - Username yang ingin dicek
 * @param {number} currentUserId - ID user saat ini (untuk exclude saat edit)
 * @returns {Promise<boolean>} true jika username available, false jika sudah digunakan
 */
const isUsernameAvailable = async (username, currentUserId = null) => {
    try {
        let query = 'SELECT id FROM users WHERE username = ?';
        let params = [username];
        
        if (currentUserId) {
            query += ' AND id != ?';
            params.push(currentUserId);
        }
        
        const [rows] = await db.query(query, params);
        return rows.length === 0;
    } catch (error) {
        console.error('Error di isUsernameAvailable:', error);
        throw error;
    }
};

/**
 * Check if email is available (excluding current user)
 * @param {string} email - Email yang ingin dicek
 * @param {number} currentUserId - ID user saat ini (untuk exclude saat edit)
 * @returns {Promise<boolean>} true jika email available, false jika sudah digunakan
 */
const isEmailAvailable = async (email, currentUserId = null) => {
    try {
        let query = 'SELECT id FROM users WHERE email = ?';
        let params = [email];
        
        if (currentUserId) {
            query += ' AND id != ?';
            params.push(currentUserId);
        }
        
        const [rows] = await db.query(query, params);
        return rows.length === 0;
    } catch (error) {
        console.error('Error di isEmailAvailable:', error);
        throw error;
    }
};

/**
 * Update user profile dengan validasi
 * @param {number} userId - ID user yang akan diupdate
 * @param {Object} profileData - Data profile yang akan diupdate
 * @returns {Promise<Object>} Updated user data
 */
const updateUserProfile = async (userId, profileData) => {
    try {
        const {
            full_name,
            username,
            email,
            profile_picture,
            date_of_birth,
            phone_number,
            country,
            city,
            postal_code,
            location
        } = profileData;

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];

        if (full_name !== undefined) {
            updateFields.push('full_name = ?');
            updateValues.push(full_name);
        }

        if (username !== undefined) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }

        if (email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }

        if (profile_picture !== undefined) {
            updateFields.push('profile_picture = ?');
            updateValues.push(profile_picture);
        }

        if (date_of_birth !== undefined) {
            updateFields.push('date_of_birth = ?');
            updateValues.push(date_of_birth);
        }

        if (phone_number !== undefined) {
            updateFields.push('phone_number = ?');
            updateValues.push(phone_number);
        }

        if (country !== undefined) {
            updateFields.push('country = ?');
            updateValues.push(country);
        }

        if (city !== undefined) {
            updateFields.push('city = ?');
            updateValues.push(city);
        }

        if (postal_code !== undefined) {
            updateFields.push('postal_code = ?');
            updateValues.push(postal_code);
        }

        if (location !== undefined) {
            updateFields.push('location = ?');
            updateValues.push(location);
        }

        // Jika tidak ada field yang diupdate
        if (updateFields.length === 0) {
            throw new Error('No fields to update');
        }

        // Add updated_at timestamp
        updateFields.push('updated_at = CURRENT_TIMESTAMP');

        // Add userId to values
        updateValues.push(userId);

        // Build and execute query
        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        
        await db.query(query, updateValues);

        // Return updated user data
        return await findUserById(userId);
    } catch (error) {
        console.error('Error di updateUserProfile:', error);
        throw error;
    }
};

/**
 * Delete profile picture
 * @param {number} userId - ID user
 * @returns {Promise<Object>} Updated user data
 */
const deleteProfilePicture = async (userId) => {
    try {
        await db.query(
            'UPDATE users SET profile_picture = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [userId]
        );
        
        return await findUserById(userId);
    } catch (error) {
        console.error('Error di deleteProfilePicture:', error);
        throw error;
    }
};

module.exports = {
    findUserById,
    isUsernameAvailable,
    isEmailAvailable,
    updateUserProfile,
    deleteProfilePicture
};
