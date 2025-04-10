const express = require('express');
const router = express.Router();
const { uploadCloud } = require('../config/cloudinary');
const { uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), uploadCloud.single('image'), uploadImage);

module.exports = router;