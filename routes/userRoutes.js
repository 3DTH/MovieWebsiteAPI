const express = require('express');
const router = express.Router();
const { 
    createUser, 
    getUsers, 
    updateUser, 
    deleteUser, 
    updateAvatar,
    getAvatars,
    updateUsername
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Routes yêu cầu xác thực
router.use(protect);

// Route lấy danh sách avatar có sẵn
router.get('/avatars', getAvatars);

// Route cập nhật avatar
router.put('/avatar', updateAvatar);

// Route cập nhật username
router.put('/username', updateUsername);

// Routes chỉ dành cho admin
router.use(authorize('admin'));

// Routes /api/users
router.route('/')
    .get(getUsers)
    .post(createUser);

// Routes /api/users/:id
router.route('/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;