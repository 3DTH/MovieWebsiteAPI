const express = require('express');
const router = express.Router();
const {
    getActorDetails,
    searchActors
} = require('../controllers/actorController');
const protect = require('../middleware/auth');

// Public routes
router.get('/search', searchActors);
router.get('/:id', getActorDetails);

module.exports = router; 