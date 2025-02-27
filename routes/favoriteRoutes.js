const express = require('express');
const router = express.Router();
const {
    addToFavorites,
    removeFromFavorites,
    getFavorites
} = require('../controllers/favoriteController');
const protect = require('../middleware/auth');

// Tất cả routes đều cần đăng nhập
router.use(protect);

router.get('/', getFavorites);
router.post('/:movieId', addToFavorites);
router.delete('/:movieId', removeFromFavorites);

module.exports = router; 