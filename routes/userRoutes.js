const express = require('express');
const router = express.Router();
const { 
    createUser, 
    getUsers, 
    getUserById,
    updateUser, 
    deleteUser, 
    updateAvatar,
    getAvatars,
    updateUsername
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Routes yêu cầu xác thực
router.use(protect);

router.get('/avatars', getAvatars);
router.put('/avatar', updateAvatar);
router.put('/username', updateUsername);

// Routes chỉ dành cho admin
router.use(authorize('admin'));

// Routes /api/users
router.route('/')
    .get(getUsers)
    .post(createUser);

// Routes /api/users/:id
router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;