const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ErrorResponse } = require('./error');

// Middleware bảo vệ route
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new ErrorResponse('Không có quyền truy cập', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponse('Không có quyền truy cập', 401));
    }
};

// Middleware kiểm tra role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse('Không có quyền thực hiện hành động này', 403));
        }
        next();
    };
}; 