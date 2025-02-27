const express = require('express');
const router = express.Router();
const {
    syncMovies,
    getMovies,
    initialSync,
    getMovieDetails
} = require('../controllers/movieController');
const protect = require('../middleware/auth');

// Public routes
router.get('/initial-sync', initialSync);
router.get('/', getMovies);
router.get('/:id', getMovieDetails);

// Protected routes
router.post('/sync', protect, syncMovies);

module.exports = router; 