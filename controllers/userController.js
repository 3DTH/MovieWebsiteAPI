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

// Lấy userId
exports.getUserById = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
  
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
  
      res.status(200).json({
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
        const { username, email, role, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role, avatar },
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

// Cập nhật avatar người dùng
exports.updateAvatar = async (req, res, next) => {
    try {
        const { avatarPath } = req.body;
        
        // Kiểm tra nếu avatarPath không hợp lệ
        if (!avatarPath || !avatarPath.startsWith('/avatars/avatar-')) {
            return next(new ErrorResponse('Đường dẫn avatar không hợp lệ', 400));
        }
        
        // Cập nhật avatar cho người dùng hiện tại
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: avatarPath },
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

// Cập nhật username người dùng
exports.updateUsername = async (req, res, next) => {
    try {
        const { username } = req.body;
        
        // Kiểm tra username có hợp lệ không
        if (!username || username.trim().length < 3) {
            return next(new ErrorResponse('Username phải có ít nhất 3 ký tự', 400));
        }

        // Kiểm tra username đã tồn tại chưa (loại trừ user hiện tại)
        const existingUser = await User.findOne({ 
            username: username,
            _id: { $ne: req.user.id } 
        });
        
        if (existingUser) {
            return next(new ErrorResponse('Username đã được sử dụng bởi người dùng khác', 400));
        }
        
        // Cập nhật username
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { username: username },
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

// Lấy danh sách avatar có sẵn
exports.getAvatars = async (req, res, next) => {
    try {
        // Tạo danh sách đường dẫn cho 10 avatar
        const avatars = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            path: `/avatars/avatar-${i + 1}.png`
        }));

        res.json({
            success: true,
            data: avatars
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