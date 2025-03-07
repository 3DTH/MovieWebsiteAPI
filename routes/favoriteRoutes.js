const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    addToFavorites,
    removeFromFavorites,
    getFavorites
} = require('../controllers/favoriteController');

// Tất cả routes yêu cầu đăng nhập
router.use(protect);

router.get('/', getFavorites);
router.post('/:movieId', addToFavorites);
router.delete('/:movieId', removeFromFavorites);

module.exports = router; 