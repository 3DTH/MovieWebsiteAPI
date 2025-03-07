const mongoose = require('mongoose');
const moment = require('moment-timezone');

const videoSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    site: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    originalTitle: String,
    overview: String,
    posterPath: String,
    backdropPath: String,
    releaseDate: Date,
    voteAverage: Number,
    voteCount: Number,
    popularity: Number,
    genres: [{
        id: Number,
        name: String
    }],
    videos: [videoSchema],
    cast: [{
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Actor'
        },
        character: String,
        order: Number
    }],
    directors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor'
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
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
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ title: 'text', overview: 'text' });

module.exports = mongoose.model('Movie', movieSchema); 