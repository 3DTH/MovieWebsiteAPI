const Movie = require('../models/Movie');
const tmdbApi = require('../utils/tmdb');
const { ErrorResponse } = require('../middleware/error');
const Comment = require('../models/Comment');
const Actor = require('../models/Actor');
const User = require('../models/User');

// Cập nhật danh sách phim từ TMDB
exports.syncMovies = async (req, res, next) => {
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
            message: 'Đồng bộ dữ liệu phim và diễn viên thành công'
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

// Lấy chi tiết phim và lưu vào DB nếu chưa có
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

// chỉ dùng trong quá trình phát triển 
// exports.initialSync = async (req, res, next) => {
//     try {
//         console.log('Bắt đầu đồng bộ dữ liệu ban đầu...');
        
//         // Lấy nhiều trang phim
//         for(let page = 1; page <= 5; page++) {
//             const popularMovies = await tmdbApi.getPopularMovies(page);
//             console.log(`Đang xử lý trang ${page}...`);
            
//             for (const movie of popularMovies.results) {
//                 console.log(`Đang xử lý phim: ${movie.title}`);
                
//                 // Kiểm tra xem phim đã tồn tại chưa
//                 const existingMovie = await Movie.findOne({ tmdbId: movie.id });
//                 if (existingMovie) {
//                     console.log(`Phim ${movie.title} đã tồn tại, bỏ qua...`);
//                     continue;
//                 }

//                 // Lấy chi tiết phim và videos
//                 const movieDetails = await tmdbApi.getMovieDetails(movie.id);
                
//                 // Lưu vào database
//                 await Movie.create({
//                     tmdbId: movie.id,
//                     title: movie.title,
//                     originalTitle: movie.original_title,
//                     overview: movie.overview,
//                     posterPath: movie.poster_path,
//                     backdropPath: movie.backdrop_path,
//                     releaseDate: movie.release_date,
//                     voteAverage: movie.vote_average,
//                     voteCount: movie.vote_count,
//                     popularity: movie.popularity,
//                     genres: movieDetails.genres,
//                     videos: movieDetails.videos,
//                     lastUpdated: new Date()
//                 });
                
//                 console.log(`Đã lưu phim: ${movie.title} với ${movieDetails.videos?.length || 0} videos`);
                
//                 // Đợi 1 giây để tránh vượt quá giới hạn rate của TMDB API
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//             }
//         }

//         res.json({
//             success: true,
//             message: 'Đồng bộ dữ liệu ban đầu thành công'
//         });
//     } catch (error) {
//         console.error('Lỗi:', error);
//         next(error);
//     }
// }; 

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

// Hàm migration để cập nhật database
exports.migrateMovieActors = async (req, res, next) => {
    try {
        console.log('Bắt đầu migration...');
        
        // Lấy tất cả phim
        const movies = await Movie.find();
        console.log(`Tìm thấy ${movies.length} phim cần cập nhật`);

        for (const movie of movies) {
            try {
                console.log(`Đang xử lý phim: ${movie.title}`);

                // Lấy thông tin mới từ TMDB
                const movieDetails = await tmdbApi.getMovieDetails(movie.tmdbId);

                // Cập nhật phim với cast và directors mới
                const updatedMovie = await Movie.findByIdAndUpdate(movie._id, {
                    cast: movieDetails.cast,
                    directors: movieDetails.directors,
                    lastUpdated: new Date()
                }, { new: true });

                // Cập nhật movies trong bảng Actor
                for (const castMember of updatedMovie.cast) {
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

                // Cập nhật cho directors
                for (const directorId of updatedMovie.directors) {
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

                console.log(`Đã cập nhật phim và diễn viên cho: ${movie.title}`);

                // Thêm delay để tránh rate limit
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Lỗi khi xử lý phim ${movie.title}:`, error);
                continue; // Tiếp tục với phim tiếp theo nếu có lỗi
            }
        }

        res.json({
            success: true,
            message: `Đã cập nhật ${movies.length} phim và diễn viên thành công`
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