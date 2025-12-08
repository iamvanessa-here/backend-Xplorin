const { 
    findUserById, 
    isUsernameAvailable, 
    isEmailAvailable,
    updateUserProfile: updateUserProfileModel,
    deleteProfilePicture 
} = require('../models/profile');

/**
 * Get profile user yang sedang login
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('📋 Getting profile for user ID:', userId);

        const user = await findUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        // Remove password from response (jika ada)
        delete user.password;

        console.log('✅ Profile data retrieved successfully');
        res.status(200).json({
            success: true,
            message: 'Data profile berhasil diambil',
            data: user
        });

    } catch (error) {
        console.error('❌ Error di getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

/**
 * Update profile user
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
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
        } = req.body;

        console.log('📝 Update profile request for user:', userId);
        console.log('📦 Data received:', {
            full_name,
            username,
            email,
            has_profile_picture: !!profile_picture,
            profile_picture_size: profile_picture ? profile_picture.length : 0,
            date_of_birth,
            phone_number,
            country,
            city,
            postal_code,
            location
        });

        // Validasi: minimal harus ada satu field yang diupdate
        if (!full_name && !username && !email && !profile_picture && !date_of_birth && 
            !phone_number && !country && !city && !postal_code && !location) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada data yang akan diupdate'
            });
        }

        // Validasi profile picture size (max 5MB)
        if (profile_picture && profile_picture.length > 5 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: 'Profile picture terlalu besar. Maksimal 5MB'
            });
        }

        // Check username availability jika username berubah
        if (username) {
            const usernameAvailable = await isUsernameAvailable(username, userId);
            if (!usernameAvailable) {
                return res.status(409).json({
                    success: false,
                    message: 'Username sudah digunakan'
                });
            }
        }

        // Check email availability jika email berubah
        if (email) {
            const emailAvailable = await isEmailAvailable(email, userId);
            if (!emailAvailable) {
                return res.status(409).json({
                    success: false,
                    message: 'Email sudah digunakan'
                });
            }
        }

        // Prepare data untuk update
        const updateData = {};
        
        if (full_name !== undefined) updateData.full_name = full_name;
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;
        if (profile_picture !== undefined) updateData.profile_picture = profile_picture;
        if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;
        if (phone_number !== undefined) updateData.phone_number = phone_number;
        if (country !== undefined) updateData.country = country;
        if (city !== undefined) updateData.city = city;
        if (postal_code !== undefined) updateData.postal_code = postal_code;
        if (location !== undefined) updateData.location = location;

        console.log('🔄 Executing update...');
        
        // Update profile menggunakan model
        const updatedUser = await updateUserProfileModel(userId, updateData);
        
        console.log('✅ Profile updated successfully');

        // Remove password from response
        delete updatedUser.password;

        res.status(200).json({
            success: true,
            message: 'Profile berhasil diupdate',
            data: updatedUser
        });

    } catch (error) {
        console.error('❌ Error di updateProfile:', error);
        
        // Handle duplicate entry errors
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('username')) {
                return res.status(409).json({
                    success: false,
                    message: 'Username sudah digunakan'
                });
            }
            if (error.message.includes('email')) {
                return res.status(409).json({
                    success: false,
                    message: 'Email sudah digunakan'
                });
            }
            return res.status(409).json({
                success: false,
                message: 'Data sudah ada dalam sistem'
            });
        }

        // Handle entity too large
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

/**
 * Check username availability
 * POST /api/auth/check-username
 */
const checkUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user ? req.user.userId : null;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username harus diisi'
            });
        }

        console.log('🔍 Checking username availability:', username);

        const available = await isUsernameAvailable(username, userId);

        console.log(`✅ Username '${username}' is ${available ? 'available' : 'taken'}`);

        res.status(200).json({
            success: true,
            available: available,
            message: available ? 'Username tersedia' : 'Username sudah digunakan'
        });

    } catch (error) {
        console.error('❌ Error di checkUsername:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

/**
 * Delete profile picture
 * DELETE /api/auth/profile-picture
 */
const removeProfilePicture = async (req, res) => {
    try {
        const userId = req.user.userId;

        console.log('🗑️ Deleting profile picture for user:', userId);

        const updatedUser = await deleteProfilePicture(userId);

        // Remove password from response
        delete updatedUser.password;

        console.log('✅ Profile picture deleted successfully');

        res.status(200).json({
            success: true,
            message: 'Profile picture berhasil dihapus',
            data: updatedUser
        });

    } catch (error) {
        console.error('❌ Error di removeProfilePicture:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    checkUsername,
    removeProfilePicture
};