const { Restaurant } = require('../models/restaurant');

// Get restaurant by slug
exports.getRestaurantBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: 'Slug parameter is required'
            });
        }

        const restaurant = await Restaurant.findBySlug(slug);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant
        });

    } catch (error) {
        console.error('Error in getRestaurantBySlug:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all restaurants with pagination
exports.getAllRestaurants = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        // Validate pagination parameters
        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be between 1 and 100'
            });
        }

        if (offset < 0) {
            return res.status(400).json({
                success: false,
                message: 'Offset must be non-negative'
            });
        }

        const result = await Restaurant.findAll(limit, offset);

        res.status(200).json({
            success: true,
            data: result.restaurants,
            pagination: result.pagination
        });

    } catch (error) {
        console.error('Error in getAllRestaurants:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create new restaurant (optional - untuk admin)
exports.createRestaurant = async (req, res) => {
    try {
        const restaurantData = req.body;

        // Validate required fields
        if (!restaurantData.slug || !restaurantData.title) {
            return res.status(400).json({
                success: false,
                message: 'Slug and title are required'
            });
        }

        const result = await Restaurant.create(restaurantData);

        res.status(201).json({
            success: true,
            message: 'Restaurant created successfully',
            data: result
        });

    } catch (error) {
        console.error('Error in createRestaurant:', error);
        
        // Handle duplicate slug error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Restaurant with this slug already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
