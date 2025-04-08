const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const {
    getComments,
    addComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');

// Public route - không cần xác thực
router.get('/', getComments);

// Protected routes - yêu cầu xác thực
router.use(protect);
router.post('/', addComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;