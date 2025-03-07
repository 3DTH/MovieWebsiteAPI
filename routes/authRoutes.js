const express = require('express');
const router = express.Router();
const { register, login, googleAuth, googleCallback, facebookAuth, facebookCallback } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookCallback);

module.exports = router;