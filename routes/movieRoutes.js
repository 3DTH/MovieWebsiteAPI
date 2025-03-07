const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    syncMovies,
    getMovies,
    getMovieDetails,
    searchMovies,
    migrateMovieActors,
    deleteMovie
} = require('../controllers/movieController');
const commentRouter = require('./commentRoutes');

// Public routes
router.get('/search', searchMovies);
router.get('/', getMovies);
router.get('/:id', getMovieDetails);

// Protected routes (yêu cầu đăng nhập)
router.use(protect);

// Admin routes
router.post('/sync', authorize('admin'), syncMovies);
router.post('/migrate-actors', authorize('admin'), migrateMovieActors);
router.delete('/:id', authorize('admin'), deleteMovie);

// Re-route vào comment routes
router.use('/:movieId/comments', commentRouter);

module.exports = router; 