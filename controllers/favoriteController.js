const User = require('../models/User');
const Movie = require('../models/Movie');
const { ErrorResponse } = require('../middleware/error');

// Thêm phim vào danh sách yêu thích
exports.addToFavorites = async (req, res, next) => {
    try {
        const movieId = req.params.movieId;
        const userId = req.user.id;

        // Kiểm tra phim tồn tại
        const movie = await Movie.findOne({ tmdbId: movieId });
        if (!movie) {
            return next(new ErrorResponse('Không tìm thấy phim', 404));
        }

        // Thêm vào danh sách yêu thích
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: movie._id } },
            { new: true }
        ).populate('favorites');

        res.json({
            success: true,
            data: user.favorites
        });
    } catch (error) {
        next(error);
    }
};

// Xóa phim khỏi danh sách yêu thích
exports.removeFromFavorites = async (req, res, next) => {
    try {
        const movieId = req.params.movieId;
        const userId = req.user.id;

        const movie = await Movie.findOne({ tmdbId: movieId });
        if (!movie) {
            return next(new ErrorResponse('Không tìm thấy phim', 404));
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: movie._id } },
            { new: true }
        ).populate('favorites');

        res.json({
            success: true,
            data: user.favorites
        });
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách phim yêu thích
exports.getFavorites = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        
        res.json({
            success: true,
            data: user.favorites
        });
    } catch (error) {
        next(error);
    }
}; 