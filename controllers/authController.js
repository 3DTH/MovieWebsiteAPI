const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ErrorResponse } = require('../middleware/error');
const passport = require('passport');

// Helper function để tạo token và response
const createTokenResponse = (user) => {
    const token = jwt.sign(
        { 
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );

    return {
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt
        }
    };
};

// Chia sẻ helper function
exports.createTokenResponse = createTokenResponse;

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra user đã tồn tại
        let user = await User.findOne({ email });
        if (user) {
            return next(new ErrorResponse('Email đã được sử dụng', 400));
        }

        // Tạo user mới với role mặc định là 'user'
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

// Lấy thông tin người dùng hiện tại
exports.getMe = async (req, res, next) => {
  try {
    // req.user.id có sẵn từ middleware auth.protect
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return next(new ErrorResponse('Không tìm thấy người dùng', 404));
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth routes
exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
});

exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        if (err) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message)}`);
        }
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent('Không thể đăng nhập bằng Google')}`);
        }

        // Tạo JWT token
        const token = createTokenResponse(user);

        // Redirect về frontend với token
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token.token}`);
    })(req, res, next);
};

// Facebook OAuth routes
exports.facebookAuth = passport.authenticate('facebook', {
    scope: ['email']
});

exports.facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', (err, user) => {
        if (err) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message)}`);
        }
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent('Không thể đăng nhập bằng Facebook')}`);
        }

        // Tạo JWT token
        const token = createTokenResponse(user);

        // Redirect về frontend với token
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token.token}`);
    })(req, res, next);
};