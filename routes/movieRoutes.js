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
    uploadMovieFile,
    getSimilarMovies,
    getNewMovies,
    getPopularMovies,
    getTopRatedMovies
} = require('../controllers/movieController');
const commentRouter = require('./commentRoutes');

// Public routes
router.get('/search', searchMovies);
router.get('/', getMovies);
router.get('/new', getNewMovies);
router.get('/popular', getPopularMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/:id/video', getMovieEmbedUrl);
router.get('/:id/similar', getSimilarMovies);
router.get('/:id', getMovieDetails);

// Re-route vào comment routes
router.use('/:movieId/comments', commentRouter);

// Protected routes (yêu cầu đăng nhập)
router.use(protect);

// Admin routes
router.post('/sync-popular', authorize('admin'), syncPopularMovies);
router.post('/sync-now-playing', authorize('admin'), syncNowPlayingMovies);
router.post('/sync-all', authorize('admin'), syncAllMovies);
router.post('/:id/upload', authorize('admin'), uploadMovieFile);
router.put('/:id', authorize('admin'), updateMovie);
router.delete('/:id', authorize('admin'), deleteMovie);

module.exports = router;