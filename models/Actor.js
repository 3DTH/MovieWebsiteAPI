const mongoose = require('mongoose');
const moment = require('moment-timezone');

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

actorSchema.index({ tmdbId: 1 });
actorSchema.index({ name: 'text' });

module.exports = mongoose.model('Actor', actorSchema); 