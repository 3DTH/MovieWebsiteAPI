const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ErrorResponse } = require('../middleware/error');

// Helper function để tạo token và response
const createTokenResponse = (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    return {
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    };
};

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra user đã tồn tại
        let user = await User.findOne({ email });
        if (user) {
            return next(new ErrorResponse('Email đã được sử dụng', 400));
        }

        // Tạo user mới
        user = await User.create({
            username,
            email,
            password
        });

        // Trả về response với token
        res.status(201).json(createTokenResponse(user));
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorResponse('Vui lòng nhập email và mật khẩu', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Email hoặc mật khẩu không đúng', 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new ErrorResponse('Email hoặc mật khẩu không đúng', 401));
        }

        // Trả về response với token
        res.json(createTokenResponse(user));
    } catch (error) {
        next(error);
    }
}; 