const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
    findUserByEmailForLogin, 
    findUserByUsernameForLogin,
    updateLastLogin 
} = require('../models/login');
require('dotenv').config();

// Controller untuk login user
const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validasi input
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/Username dan password wajib diisi'
            });
        }

        // Cek apakah identifier adalah email atau username
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let user;

        if (emailRegex.test(identifier)) {
            // Login dengan email
            user = await findUserByEmailForLogin(identifier);
        } else {
            // Login dengan username
            user = await findUserByUsernameForLogin(identifier);
        }

        // Cek apakah user ditemukan
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email/Username atau password salah'
            });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email/Username atau password salah'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET || 'default_secret_key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Update last login (opsional)
        await updateLastLogin(user.id);

        // Response sukses dengan token
        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name
                }
            }
        });

    } catch (error) {
        console.error('Error di loginUser:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

// Controller untuk mendapatkan profile user yang sedang login
const getProfile = async (req, res) => {
    try {
        // Data user sudah ada di req.user dari middleware
        const { findUserById } = require('../models/login');
        const user = await findUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
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

module.exports = {
    loginUser,
    getProfile
};
