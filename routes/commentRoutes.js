const express = require('express');
const router = express.Router({ mergeParams: true }); // Để nhận params từ parent router
const { protect } = require('../middleware/auth');
const {
    getComments,
    addComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');

// Public routes
router.get('/', getComments);

// Protected routes
router.use(protect);
router.post('/', addComment);
router.route('/:id')
    .put(updateComment)
    .delete(deleteComment);

module.exports = router; 