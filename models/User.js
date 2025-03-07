const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Vui lòng nhập tên người dùng'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: 6,
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie' // Tham chiếu đến model Movie
    }]
}, {
    timestamps: true,
    toJSON: { 
        transform: function(doc, ret) {
            // Chuyển đổi múi giờ sang Asia/Ho_Chi_Minh
            ret.createdAt = moment(ret.createdAt).tz('Asia/Ho_Chi_Minh').format();
            ret.updatedAt = moment(ret.updatedAt).tz('Asia/Ho_Chi_Minh').format();
            return ret;
        }
    }
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema); 