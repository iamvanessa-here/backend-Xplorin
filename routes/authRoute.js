const express = require('express');
const router = express.Router();

// Import controllers
const { loginUser } = require('../controller/login');
const { registerUser } = require('../controller/register');
const { getProfile, updateProfile } = require('../controller/profile');

// Import middleware
const { 
    verifyToken, 
    validateRegisterInput, 
    validateLoginInput 
} = require('../middleware/index');

// Route untuk registrasi user baru
// POST /api/auth/register
router.post('/register', validateRegisterInput, registerUser);

// Route untuk login
// POST /api/auth/login
router.post('/login', validateLoginInput, loginUser);

// Route untuk mendapatkan profile user (protected route)
// GET /api/auth/profile
router.get('/profile', verifyToken, getProfile);

// Route untuk update profile user (protected route)
// PUT /api/auth/profile
router.put('/profile', verifyToken, updateProfile);

// Route untuk test endpoint (opsional)
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth API is working!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;

// Route untuk test endpoint (opsional)
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth API is working!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
