const mongoose = require('mongoose');

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
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema); 