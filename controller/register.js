const bcrypt = require('bcryptjs');
const { 
    createUser, 
    findUserByEmail, 
    findUserByUsername 
} = require('../models/register');

// Controller untuk registrasi user baru
const registerUser = async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;

        // Validasi input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, dan password wajib diisi'
            });
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }

        // Validasi panjang password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password minimal 6 karakter'
            });
        }

        // Cek apakah email sudah terdaftar
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        // Cek apakah username sudah terdaftar
        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan'
            });
        }

        // Hash password dengan bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Simpan user baru ke database
        const userData = {
            username,
            email,
            password: hashedPassword,
            full_name: full_name || null
        };

        const result = await createUser(userData);

        // Response sukses
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: {
                userId: result.insertId,
                username,
                email,
                full_name: full_name || null
            }
        });

    } catch (error) {
        console.error('Error di registerUser:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

module.exports = {
    registerUser
};
