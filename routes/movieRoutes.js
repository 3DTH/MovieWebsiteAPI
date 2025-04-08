const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMovies,
  getMovieDetails,
  searchMovies,
  getFilteredMovies,
  syncPopularMovies,
  syncNowPlayingMovies,
  syncAllMovies,
  updateMovie,
  deleteMovie,
  uploadMovieFile,
  getMovieEmbedUrl,
  getSimilarMovies,
  getNewMovies
} = require('../controllers/movieController');

// Public routes
router.get('/', getMovies);
router.get('/search', searchMovies);
router.get('/filter', getFilteredMovies);
router.get('/new', getNewMovies);
router.get('/:id', getMovieDetails);
router.get('/:id/similar', getSimilarMovies);
router.get('/:id/embed', getMovieEmbedUrl);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/sync/popular', syncPopularMovies);
router.post('/sync/nowplaying', syncNowPlayingMovies);
router.post('/sync/all', syncAllMovies);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);
router.post('/:id/upload', uploadMovieFile);

// Admin routes
router.post('/sync-popular', authorize('admin'), syncPopularMovies);
router.post('/sync-now-playing', authorize('admin'), syncNowPlayingMovies);
router.post('/sync-all', authorize('admin'), syncAllMovies);
router.post('/:id/upload', authorize('admin'), uploadMovieFile);
router.put('/:id', authorize('admin'), updateMovie);
router.delete('/:id', authorize('admin'), deleteMovie);

module.exports = router;