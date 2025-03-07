const User = require('../models/User');
const { ErrorResponse } = require('../middleware/error');

// Tạo user mới (chỉ admin)
exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse('Email đã được sử dụng', 400));
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'user'
        });

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách users (chỉ admin)
exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments()
        ]);

        res.json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// Cập nhật user
exports.updateUser = async (req, res, next) => {
    try {
        const { username, email, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return next(new ErrorResponse('Không tìm thấy user', 404));
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Xóa user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return next(new ErrorResponse('Không tìm thấy user', 404));
        }

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
}; 