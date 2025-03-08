const Movie = require('../models/Movie');
const tmdbApi = require('../utils/tmdb');
const { ErrorResponse } = require('../middleware/error');
const Comment = require('../models/Comment');
const Actor = require('../models/Actor');
const User = require('../models/User');

// Cập nhật danh sách phim phổ biến
exports.syncPopularMovies = async (req, res, next) => {
    try {
        const popularMovies = await tmdbApi.getPopularMovies();
        
        for (const movie of popularMovies.results) {
            try {
                // Lấy chi tiết phim từ TMDB (đã bao gồm xử lý actors)
                const movieDetails = await tmdbApi.getMovieDetails(movie.id);
                
                // Cập nhật hoặc tạo mới phim trong database
                const updatedMovie = await Movie.findOneAndUpdate(
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
                        isPopular: true,
                        genres: movieDetails.genres,
                        videos: movieDetails.videos,
                        cast: movieDetails.cast,
                        directors: movieDetails.directors,
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );

                // Cập nhật movies trong bảng Actor cho cast
                for (const castMember of movieDetails.cast) {
                    await Actor.findByIdAndUpdate(
                        castMember.actor,
                        {
                            $addToSet: {
                                movies: {
                                    movie: updatedMovie._id,
                                    character: castMember.character,
                                    order: castMember.order
                                }
                            }
                        }
                    );
                }

                // Cập nhật movies trong bảng Actor cho directors
                for (const directorId of movieDetails.directors) {
                    await Actor.findByIdAndUpdate(
                        directorId,
                        {
                            $addToSet: {
                                movies: {
                                    movie: updatedMovie._id,
                                    character: 'Director',
                                    order: 0
                                }
                            }
                        }
                    );
                }
                
                console.log(`Đã cập nhật phim phổ biến và diễn viên: ${movie.title}`);
                
                // Thêm delay để tránh rate limit
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Lỗi khi xử lý phim ${movie.title}:`, error);
                continue;
            }
        }

        res.json({
            success: true,
            message: 'Đồng bộ dữ liệu phim phổ biến và diễn viên thành công'
        });
    } catch (error) {
        next(error);
    }
};

// Cập nhật danh sách phim đang chiếu
exports.syncNowPlayingMovies = async (req, res, next) => {
    try {
        const nowPlayingMovies = await tmdbApi.getNowPlaying();
        
        for (const movie of nowPlayingMovies.results) {
            try {
                // Lấy chi tiết phim từ TMDB (đã bao gồm xử lý actors)
                const movieDetails = await tmdbApi.getMovieDetails(movie.id);
                
                // Cập nhật hoặc tạo mới phim trong database
                const updatedMovie = await Movie.findOneAndUpdate(
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
                        cast: movieDetails.cast,
                        directors: movieDetails.directors,
                        nowPlaying: true,  // Đánh dấu đây là phim đang chiếu
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );

                // Cập nhật movies trong bảng Actor cho cast
                for (const castMember of movieDetails.cast) {
                    await Actor.findByIdAndUpdate(
                        castMember.actor,
                        {
                            $addToSet: {
                                movies: {
                                    movie: updatedMovie._id,
                                    character: castMember.character,
                                    order: castMember.order
                                }
                            }
                        }
                    );
                }

                // Cập nhật movies trong bảng Actor cho directors
                for (const directorId of movieDetails.directors) {
                    await Actor.findByIdAndUpdate(
                        directorId,
                        {
                            $addToSet: {
                                movies: {
                                    movie: updatedMovie._id,
                                    character: 'Director',
                                    order: 0
                                }
                            }
                        }
                    );
                }
                
                console.log(`Đã cập nhật phim đang chiếu và diễn viên: ${movie.title}`);
                
                // Thêm delay để tránh rate limit
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Lỗi khi xử lý phim ${movie.title}:`, error);
                continue;
            }
        }

        res.json({
            success: true,
            message: 'Đồng bộ dữ liệu phim đang chiếu và diễn viên thành công'
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

        const [movies, total] = await Promise.all([
            Movie.find()
                .sort({ popularity: -1 })
                .skip(skip)
                .limit(limit),
            Movie.countDocuments()
        ]);

        res.json({
            success: true,
            count: movies.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: movies
        });
    } catch (error) {
        next(error);
    }
};

// Lấy chi tiết phim
exports.getMovieDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Đang tìm phim với ID:', id);
        
        const movie = await Movie.findOne({ tmdbId: id })
            .populate('cast.actor', 'name profilePath')
            .populate('directors', 'name profilePath');

        if (!movie) {
            return next(new ErrorResponse('Không tìm thấy phim', 404));
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

// Tìm kiếm phim
exports.searchMovies = async (req, res, next) => {
    try {
        const {
            keyword,
            genre,
            year,
            rating,
            page = 1,
            limit = 10
        } = req.query;

        // Xây dựng query
        let query = {};

        // Tìm theo keyword
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { overview: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Lọc theo thể loại
        if (genre) {
            query['genres.name'] = { $regex: genre, $options: 'i' };
        }

        // Lọc theo năm
        if (year) {
            query.releaseDate = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }

        // Lọc theo rating
        if (rating) {
            query.voteAverage = { $gte: Number(rating) };
        }

        // Thực hiện tìm kiếm với phân trang
        const skip = (page - 1) * limit;
        
        const [movies, total] = await Promise.all([
            Movie.find(query)
                .sort({ popularity: -1 })
                .skip(skip)
                .limit(limit),
            Movie.countDocuments(query)
        ]);

        res.json({
            success: true,
            count: movies.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: movies
        });
    } catch (error) {
        next(error);
    }
};

// Xóa phim
exports.deleteMovie = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Tìm phim bằng tmdbId
        const movie = await Movie.findOne({ tmdbId: id });
        if (!movie) {
            return next(new ErrorResponse('Không tìm thấy phim', 404));
        }

        // Xóa tất cả comments của phim
        await Comment.deleteMany({ movie: movie._id });

        // Xóa phim khỏi danh sách yêu thích của users
        await User.updateMany(
            { favorites: movie._id },
            { $pull: { favorites: movie._id } }
        );

        // Xóa phim khỏi danh sách phim của actors
        await Actor.updateMany(
            { 'movies.movie': movie._id },
            { $pull: { movies: { movie: movie._id } } }
        );

        // Xóa phim
        await Movie.deleteOne({ _id: movie._id });

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};


// Hàm để đồng bộ cả phim phổ biến và phim đang chiếu
exports.syncAllMovies = async (req, res, next) => {
    try {
        // Đồng bộ phim phổ biến
        const popularMovies = await tmdbApi.getPopularMovies();
        // Đồng bộ phim đang chiếu
        const nowPlayingMovies = await tmdbApi.getNowPlaying();
        
        // Gộp danh sách phim (loại bỏ trùng lặp bằng Set)
        const movieIds = new Set();
        const allMovies = [];
        
        // Thêm phim phổ biến
        for (const movie of popularMovies.results) {
            if (!movieIds.has(movie.id)) {
                movieIds.add(movie.id);
                allMovies.push({...movie, isPopular: true});
            }
        }
        
        // Thêm phim đang chiếu
        for (const movie of nowPlayingMovies.results) {
            if (!movieIds.has(movie.id)) {
                movieIds.add(movie.id);
                allMovies.push({...movie, nowPlaying: true});
            } else {
                // Nếu phim đã có trong danh sách (từ phim phổ biến), đánh dấu là đang chiếu
                const existingMovie = allMovies.find(m => m.id === movie.id);
                if (existingMovie) {
                    existingMovie.nowPlaying = true;
                }
            }
        }
        
        // Xử lý từng phim và lưu vào database
        for (const movie of allMovies) {
            try {
                // Lấy chi tiết phim từ TMDB (đã bao gồm xử lý actors)
                const movieDetails = await tmdbApi.getMovieDetails(movie.id);
                
                // Cập nhật hoặc tạo mới phim trong database
                const updatedMovie = await Movie.findOneAndUpdate(
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
                        isPopular: movie.isPopular || false,
                        nowPlaying: movie.nowPlaying || false,
                        genres: movieDetails.genres,
                        videos: movieDetails.videos,
                        cast: movieDetails.cast,
                        directors: movieDetails.directors,
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );

                // Cập nhật movies trong bảng Actor cho cast
                for (const castMember of movieDetails.cast) {
                    await Actor.findByIdAndUpdate(
                        castMember.actor,
                        {
                            $addToSet: {
                                movies: {
                                    movie: updatedMovie._id,
                                    character: castMember.character,
                                    order: castMember.order
                                }
                            }
                        }
                    );
                }

                // Cập nhật movies trong bảng Actor cho directors
                for (const directorId of movieDetails.directors) {
                    await Actor.findByIdAndUpdate(
                        directorId,
                        {
                            $addToSet: {
                                movies: {
                                    movie: updatedMovie._id,
                                    character: 'Director',
                                    order: 0
                                }
                            }
                        }
                    );
                }
                
                console.log(`Đã cập nhật phim và diễn viên: ${movie.title}`);
                
                // Thêm delay để tránh rate limit
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Lỗi khi xử lý phim ${movie.title}:`, error);
                continue;
            }
        }

        res.json({
            success: true,
            message: 'Đồng bộ tất cả dữ liệu phim và diễn viên thành công'
        });
    } catch (error) {
        next(error);
    }
};