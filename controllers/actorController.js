const Actor = require('../models/Actor');
const tmdbApi = require('../utils/tmdb');
const { ErrorResponse } = require('../middleware/error');

// Lấy thông tin chi tiết diễn viên
exports.getActorDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        let actor = await Actor.findOne({ tmdbId: id })
            .populate('movies.movie', 'title posterPath releaseDate tmdbId');

        if (!actor) {
            // Lấy thông tin từ TMDB nếu chưa có
            const actorDetails = await tmdbApi.getActorDetails(id);
            actor = await Actor.create(actorDetails);
        }

        res.json({
            success: true,
            data: actor
        });
    } catch (error) {
        next(error);
    }
};

// Tìm kiếm diễn viên
exports.searchActors = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = keyword ? { $text: { $search: keyword } } : {};

        const [actors, total] = await Promise.all([
            Actor.find(query)
                .sort({ popularity: -1 })
                .skip(skip)
                .limit(limit),
            Actor.countDocuments(query)
        ]);

        res.json({
            success: true,
            count: actors.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: actors
        });
    } catch (error) {
        next(error);
    }
}; 