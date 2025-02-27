const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    profilePath: String,
    biography: String,
    birthday: Date,
    placeOfBirth: String,
    popularity: Number,
    movies: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        },
        character: String,
        order: Number
    }]
}, {
    timestamps: true
});

actorSchema.index({ tmdbId: 1 });
actorSchema.index({ name: 'text' });

module.exports = mongoose.model('Actor', actorSchema); 