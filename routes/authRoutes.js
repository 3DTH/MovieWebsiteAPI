const express = require('express');
const router = express.Router();
const { register, login, googleAuth, googleCallback, facebookAuth, facebookCallback, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookCallback);

// Route bảo vệ - yêu cầu xác thực
router.get('/me', protect, getMe);

module.exports = router;