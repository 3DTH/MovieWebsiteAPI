const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    syncPopularMovies,
    getMovies,
    getMovieDetails,
    searchMovies,
    updateMovie,
    deleteMovie,
    syncNowPlayingMovies,
    syncAllMovies,
    getMovieEmbedUrl,
    uploadMovieFile
} = require('../controllers/movieController');
const commentRouter = require('./commentRoutes');

// Public routes
router.get('/search', searchMovies);
router.get('/', getMovies);
router.get('/:id/video', getMovieEmbedUrl);
router.get('/:id', getMovieDetails);

// Protected routes (yêu cầu đăng nhập)
router.use(protect);

// Admin routes
router.post('/sync-popular', authorize('admin'), syncPopularMovies);
router.post('/sync-now-playing', authorize('admin'), syncNowPlayingMovies);
router.post('/sync-all', authorize('admin'), syncAllMovies);
router.put('/:id', protect, authorize('admin'), updateMovie);
router.delete('/:id', authorize('admin'), deleteMovie);
router.post('/:id/upload', authorize('admin'), uploadMovieFile);


// Re-route vào comment routes
router.use('/:movieId/comments', commentRouter);

module.exports = router;