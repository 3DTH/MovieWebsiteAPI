const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const {
    getComments,
    addComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');

// Move all routes BEFORE the protect middleware
// Public routes
router.get('/', getComments);

// Protected routes - everything after this middleware requires authentication
router.use(protect);

// Routes that require authentication
router.post('/', addComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;