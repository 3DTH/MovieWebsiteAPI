const mongoose = require('mongoose');
const moment = require('moment-timezone');

const commentSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {  
        type: String,
        required: [true, 'Vui lòng nhập nội dung bình luận']
    }
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

// Index để tăng tốc truy vấn
commentSchema.index({ movie: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Comment', commentSchema);