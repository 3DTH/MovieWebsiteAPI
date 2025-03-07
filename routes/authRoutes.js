const express = require('express');
const router = express.Router();
const { register, login, googleAuth, googleCallback } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router; 