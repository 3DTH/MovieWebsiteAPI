const express = require('express');
const router = express.Router();
const {
    syncMovies,
    getMovies,
    initialSync,
    getMovieDetails,
    searchMovies,
    addComment,
    getMovieComments,
    migrateMovieActors
} = require('../controllers/movieController');
const protect = require('../middleware/auth');

// Public routes
router.get('/search', searchMovies);
// router.get('/initial-sync', initialSync);
router.get('/', getMovies);
router.get('/:id', getMovieDetails);

// Protected routes
router.post('/sync', protect, syncMovies);
router.post('/migrate-movie', protect, migrateMovieActors);
router.post('/:id/comments', protect, addComment);
router.get('/:id/comments', getMovieComments);

module.exports = router; 