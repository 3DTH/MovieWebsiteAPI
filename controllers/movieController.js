const Movie = require('../models/Movie');
const tmdbApi = require('../utils/tmdb');
const { ErrorResponse } = require('../middleware/error');

// Cập nhật danh sách phim từ TMDB
exports.syncMovies = async (req, res, next) => {
    try {
        // Lấy phim phổ biến từ TMDB
        const popularMovies = await tmdbApi.getPopularMovies();
        
        for (const movie of popularMovies.results) {
            // Lấy chi tiết phim và videos từ TMDB
            const movieDetails = await tmdbApi.getMovieDetails(movie.id);
            
            // Cập nhật hoặc tạo mới trong database
            await Movie.findOneAndUpdate(
                { tmdbId: movie.id },
                {
                    tmdbId: movie.id,
                    title: movie.title,
                    originalTitle: movie.original_title,
                    overview: movie.overview,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                    releaseDate: movie.release_date,
                    voteAverage: movie.vote_average,
                    voteCount: movie.vote_count,
                    popularity: movie.popularity,
                    genres: movieDetails.genres,
                    videos: movieDetails.videos,
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );
            
            console.log(`Đã cập nhật phim: ${movie.title} với ${movieDetails.videos?.length || 0} videos`);
            
            // Thêm delay để tránh rate limit
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        res.json({
            success: true,
            message: 'Đồng bộ dữ liệu phim thành công'
        });
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách phim từ database
exports.getMovies = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const movies = await Movie.find()
            .sort({ popularity: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Movie.countDocuments();

        res.json({
            success: true,
            count: movies.length,
            total,
            data: movies
        });
    } catch (error) {
        next(error);
    }
};

// Lấy chi tiết phim và lưu vào DB nếu chưa có
exports.getMovieDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Đang tìm phim với ID:', id);
        
        // Kiểm tra trong DB trước
        let movie = await Movie.findOne({ tmdbId: Number(id) });
        
        if (!movie || movie.videos.length === 0) {
            console.log('Không tìm thấy phim hoặc không có videos, đang lấy từ TMDB API...');
            const movieDetails = await tmdbApi.getMovieDetails(id);
            
            if (!movie) {
                // Tạo mới nếu chưa có phim
                movie = await Movie.create({
                    tmdbId: movieDetails.id,
                    title: movieDetails.title,
                    originalTitle: movieDetails.original_title,
                    overview: movieDetails.overview,
                    posterPath: movieDetails.poster_path,
                    backdropPath: movieDetails.backdrop_path,
                    releaseDate: movieDetails.release_date,
                    voteAverage: movieDetails.vote_average,
                    voteCount: movieDetails.vote_count,
                    popularity: movieDetails.popularity,
                    genres: movieDetails.genres,
                    videos: movieDetails.videos,
                    lastUpdated: new Date()
                });
            } else {
                // Cập nhật videos nếu phim đã tồn tại
                movie = await Movie.findOneAndUpdate(
                    { tmdbId: Number(id) },
                    { 
                        videos: movieDetails.videos,
                        lastUpdated: new Date()
                    },
                    { new: true }
                );
            }
            console.log('Đã cập nhật phim với videos:', movie.videos);
        }

        res.json({
            success: true,
            data: movie
        });
    } catch (error) {
        console.error('Lỗi:', error);
        next(error);
    }
};

// Thêm đánh giá cho phim
exports.addReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const movie = await Movie.findOne({ tmdbId: id });
        if (!movie) {
            return next(new ErrorResponse('Không tìm thấy phim', 404));
        }

        // Kiểm tra xem user đã đánh giá chưa
        const existingReview = movie.reviews.find(
            review => review.user.toString() === req.user.id
        );

        if (existingReview) {
            return next(new ErrorResponse('Bạn đã đánh giá phim này rồi', 400));
        }

        movie.reviews.push({
            user: req.user.id,
            rating,
            comment
        });

        await movie.save();

        res.status(201).json({
            success: true,
            data: movie
        });
    } catch (error) {
        next(error);
    }
};

// chỉ dùng trong quá trình phát triển 
exports.initialSync = async (req, res, next) => {
    try {
        console.log('Bắt đầu đồng bộ dữ liệu ban đầu...');
        
        // Lấy nhiều trang phim
        for(let page = 1; page <= 5; page++) {
            const popularMovies = await tmdbApi.getPopularMovies(page);
            console.log(`Đang xử lý trang ${page}...`);
            
            for (const movie of popularMovies.results) {
                console.log(`Đang xử lý phim: ${movie.title}`);
                
                // Kiểm tra xem phim đã tồn tại chưa
                const existingMovie = await Movie.findOne({ tmdbId: movie.id });
                if (existingMovie) {
                    console.log(`Phim ${movie.title} đã tồn tại, bỏ qua...`);
                    continue;
                }

                // Lấy chi tiết phim và videos
                const movieDetails = await tmdbApi.getMovieDetails(movie.id);
                
                // Lưu vào database
                await Movie.create({
                    tmdbId: movie.id,
                    title: movie.title,
                    originalTitle: movie.original_title,
                    overview: movie.overview,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                    releaseDate: movie.release_date,
                    voteAverage: movie.vote_average,
                    voteCount: movie.vote_count,
                    popularity: movie.popularity,
                    genres: movieDetails.genres,
                    videos: movieDetails.videos,
                    lastUpdated: new Date()
                });
                
                console.log(`Đã lưu phim: ${movie.title} với ${movieDetails.videos?.length || 0} videos`);
                
                // Đợi 1 giây để tránh vượt quá giới hạn rate của TMDB API
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        res.json({
            success: true,
            message: 'Đồng bộ dữ liệu ban đầu thành công'
        });
    } catch (error) {
        console.error('Lỗi:', error);
        next(error);
    }
}; 