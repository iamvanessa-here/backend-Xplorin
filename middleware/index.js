const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware untuk verifikasi JWT token
const verifyToken = (req, res, next) => {
    try {
        // Ambil token dari header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

        // Cek apakah token ada
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan. Silakan login terlebih dahulu'
            });
        }

        // Verifikasi token
        jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key', (err, decoded) => {
            if (err) {
                // Token tidak valid atau expired
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Token sudah kadaluarsa. Silakan login kembali'
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: 'Token tidak valid'
                });
            }

            // Token valid, simpan data user ke request
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error('Error di verifyToken middleware:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

// Middleware opsional untuk validasi request body
const validateRegisterInput = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || username.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Username tidak boleh kosong'
        });
    }

    if (!email || email.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Email tidak boleh kosong'
        });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password minimal 6 karakter'
        });
    }

    next();
};

// Middleware opsional untuk validasi login input
const validateLoginInput = (req, res, next) => {
    const { identifier, password } = req.body;

    if (!identifier || identifier.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Email/Username tidak boleh kosong'
        });
    }

    if (!password || password.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Password tidak boleh kosong'
        });
    }

    next();
};

module.exports = {
    verifyToken,
    validateRegisterInput,
    validateLoginInput
};
