const { findUserById } = require('../models/login');

// Controller untuk mendapatkan profile user yang sedang login
const getProfile = async (req, res) => {
    try {
        // Data user sudah ada di req.user dari middleware verifyToken
        const user = await findUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data profile berhasil diambil',
            data: user
        });

    } catch (error) {
        console.error('Error di getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

// Controller untuk update profile user
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { 
            full_name, 
            username, 
            profile_picture, 
            date_of_birth, 
            phone_number, 
            country, 
            city, 
            postal_code,
            location 
        } = req.body;

        console.log('📝 Update profile request for user:', userId);
        console.log('📦 Data received:', {
            full_name,
            username,
            has_profile_picture: !!profile_picture,
            profile_picture_size: profile_picture ? profile_picture.length : 0,
            date_of_birth,
            phone_number,
            country,
            city,
            postal_code,
            location
        });

        // Validasi input - minimal harus ada satu field yang diupdate
        if (!full_name && !username && !profile_picture && !date_of_birth && 
            !phone_number && !country && !city && !postal_code && !location) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada data yang akan diupdate'
            });
        }

        // Validate profile picture size (if provided)
        if (profile_picture && profile_picture.length > 5 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: 'Profile picture too large. Maximum size is 5MB'
            });
        }

        const db = require('../config/db');
        let updateQuery = 'UPDATE users SET ';
        const updateValues = [];
        const updateFields = [];

        if (full_name) {
            updateFields.push('full_name = ?');
            updateValues.push(full_name);
        }

        if (username) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }

        if (profile_picture !== undefined) {
            updateFields.push('profile_picture = ?');
            updateValues.push(profile_picture);
        }

        if (date_of_birth) {
            updateFields.push('date_of_birth = ?');
            updateValues.push(date_of_birth);
        }

        if (phone_number !== undefined) {
            updateFields.push('phone_number = ?');
            updateValues.push(phone_number);
        }

        if (country) {
            updateFields.push('country = ?');
            updateValues.push(country);
        }

        if (city) {
            updateFields.push('city = ?');
            updateValues.push(city);
        }

        if (postal_code) {
            updateFields.push('postal_code = ?');
            updateValues.push(postal_code);
        }

        if (location) {
            updateFields.push('location = ?');
            updateValues.push(location);
        }

        updateQuery += updateFields.join(', ');
        updateQuery += ', updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        updateValues.push(userId);

        console.log('🔄 Executing update query...');
        await db.query(updateQuery, updateValues);
        console.log('✅ Database updated successfully');

        // Ambil data user yang sudah diupdate
        const updatedUser = await findUserById(userId);
        console.log('📤 Sending updated user data');

        res.status(200).json({
            success: true,
            message: 'Profile berhasil diupdate',
            data: updatedUser
        });

    } catch (error) {
        console.error('❌ Error di updateProfile:', error);
        
        // Handle duplicate username error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan'
            });
        }

        // Handle too large payload
        if (error.type === 'entity.too.large') {
            return res.status(413).json({
                success: false,
                message: 'Data terlalu besar. Profile picture maksimal 5MB'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
};