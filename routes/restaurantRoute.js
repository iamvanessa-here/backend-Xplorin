const express = require('express');
const router = express.Router();
const restaurantController = require('../controller/restaurant');
const authMiddleware = require('../middleware/index');

// Public routes - tidak perlu JWT
router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/:slug', restaurantController.getRestaurantBySlug);

// Protected route - perlu JWT (optional, untuk admin yang ingin menambah restaurant)
router.post('/restaurants', authMiddleware.verifyToken, restaurantController.createRestaurant);

module.exports = router;
