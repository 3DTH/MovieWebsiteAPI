const Comment = require('../models/Comment');
const Movie = require('../models/Movie');
const { ErrorResponse } = require('../middleware/error');

// Lấy tất cả comments của một phim
exports.getComments = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Tìm movie bằng tmdbId
        const movie = await Movie.findOne({ tmdbId: movieId });
        if (!movie) {
            return next(new ErrorResponse('Không tìm thấy phim', 404));
        }

        const [comments, total] = await Promise.all([
            Comment.find({ movie: movie._id })
                .populate('user', 'username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Comment.countDocuments({ movie: movie._id })
        ]);

        res.json({
            success: true,
            count: comments.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: comments
        });
    } catch (error) {
        next(error);
    }
};

// Thêm comment mới
exports.addComment = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const { content } = req.body;

        if (!content) {
            return next(new ErrorResponse('Vui lòng nhập nội dung bình luận', 400));
        }

        const movie = await Movie.findOne({ tmdbId: movieId });
        if (!movie) {
            return next(new ErrorResponse('Không tìm thấy phim', 404));
        }

        // Kiểm tra user đã bình luận chưa
        const existingComment = await Comment.findOne({
            movie: movie._id,
            user: req.user.id
        });

        if (existingComment) {
            return next(new ErrorResponse('Bạn đã bình luận phim này rồi', 400));
        }

        const newComment = await Comment.create({
            content,
            movie: movie._id,
            user: req.user.id
        });

        await newComment.populate('user', 'username');

        res.status(201).json({
            success: true,
            data: newComment
        });
    } catch (error) {
        next(error);
    }
};

// Cập nhật comment
exports.updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return next(new ErrorResponse('Vui lòng nhập nội dung bình luận', 400));
        }

        let comment = await Comment.findById(id);
        if (!comment) {
            return next(new ErrorResponse('Không tìm thấy bình luận', 404));
        }

        // Kiểm tra quyền sửa comment
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Không có quyền sửa bình luận này', 403));
        }

        // Cập nhật comment
        comment = await Comment.findByIdAndUpdate(
            id,
            { content },
            { new: true, runValidators: true }
        ).populate('user', 'username');

        res.json({
            success: true,
            data: comment
        });
    } catch (error) {
        next(error);
    }
};

// Xóa comment
exports.deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return next(new ErrorResponse('Không tìm thấy bình luận', 404));
        }

        // Kiểm tra quyền xóa comment
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Không có quyền xóa bình luận này', 403));
        }

        // Sử dụng deleteOne thay vì remove
        await Comment.deleteOne({ _id: id });

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
}; 