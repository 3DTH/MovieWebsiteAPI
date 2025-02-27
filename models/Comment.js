const mongoose = require('mongoose');

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
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Index để tăng tốc truy vấn
commentSchema.index({ movie: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Comment', commentSchema); 