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
        const { full_name, username } = req.body;

        // Validasi input
        if (!full_name && !username) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada data yang akan diupdate'
            });
        }

        const db = require('../config/db');
        let updateQuery = 'UPDATE users SET ';
        const updateValues = [];

        if (full_name) {
            updateQuery += 'full_name = ?';
            updateValues.push(full_name);
        }

        if (username) {
            if (full_name) updateQuery += ', ';
            updateQuery += 'username = ?';
            updateValues.push(username);
        }

        updateQuery += ' WHERE id = ?';
        updateValues.push(userId);

        await db.query(updateQuery, updateValues);

        // Ambil data user yang sudah diupdate
        const updatedUser = await findUserById(userId);

        res.status(200).json({
            success: true,
            message: 'Profile berhasil diupdate',
            data: updatedUser
        });

    } catch (error) {
        console.error('Error di updateProfile:', error);
        
        // Handle duplicate username error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan'
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