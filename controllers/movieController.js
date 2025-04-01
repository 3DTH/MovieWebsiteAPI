const Movie = require("../models/Movie");
const tmdbApi = require("../utils/tmdb");
const { ErrorResponse } = require("../middleware/error");
const Comment = require("../models/Comment");
const Actor = require("../models/Actor");
const User = require("../models/User");
const googleDriveService = require("../services/googleDriveService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cập nhật danh sách phim phổ biến
exports.syncPopularMovies = async (req, res, next) => {
  try {
    const { page = 1, totalPages = 1 } = req.query;
    const results = [];

    for (let currentPage = page; currentPage <= totalPages; currentPage++) {
      const popularMovies = await tmdbApi.getPopularMovies(currentPage);
      console.log(`Đang xử lý trang ${currentPage}/${totalPages} của phim phổ biến`);

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
              lastUpdated: new Date(),
            },
            { upsert: true, new: true }
          );

          // Cập nhật movies trong bảng Actor cho cast
          for (const castMember of movieDetails.cast) {
            await Actor.findByIdAndUpdate(castMember.actor, {
              $addToSet: {
                movies: {
                  movie: updatedMovie._id,
                  character: castMember.character,
                  order: castMember.order,
                },
              },
            });
          }

          // Cập nhật movies trong bảng Actor cho directors
          for (const directorId of movieDetails.directors) {
            await Actor.findByIdAndUpdate(directorId, {
              $addToSet: {
                movies: {
                  movie: updatedMovie._id,
                  character: "Director",
                  order: 0,
                },
              },
            });
          }

          console.log(`Đã cập nhật phim phổ biến và diễn viên: ${movie.title} (Trang ${currentPage})`);
        } catch (error) {
          console.error(`Lỗi khi xử lý phim ${movie.title} ở trang ${currentPage}:`, error);
          continue;
        }
      }
      results.push(`Trang ${currentPage}: ${popularMovies.results.length} phim`);
    }

    res.json({
      success: true,
      message: "Đồng bộ dữ liệu phim phổ biến và diễn viên thành công",
      details: results
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật danh sách phim đang chiếu
exports.syncNowPlayingMovies = async (req, res, next) => {
  try {
    const { page = 1, totalPages = 1 } = req.query;
    const results = [];

    for (let currentPage = page; currentPage <= totalPages; currentPage++) {
      const nowPlayingMovies = await tmdbApi.getNowPlaying(currentPage);
      console.log(`Đang xử lý trang ${currentPage}/${totalPages} của phim đang chiếu`);

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
              nowPlaying: true, // Đánh dấu đây là phim đang chiếu
              lastUpdated: new Date(),
            },
            { upsert: true, new: true }
          );

          // Cập nhật movies trong bảng Actor cho cast
          for (const castMember of movieDetails.cast) {
            await Actor.findByIdAndUpdate(castMember.actor, {
              $addToSet: {
                movies: {
                  movie: updatedMovie._id,
                  character: castMember.character,
                  order: castMember.order,
                },
              },
            });
          }

          // Cập nhật movies trong bảng Actor cho directors
          for (const directorId of movieDetails.directors) {
            await Actor.findByIdAndUpdate(directorId, {
              $addToSet: {
                movies: {
                  movie: updatedMovie._id,
                  character: "Director",
                  order: 0,
                },
              },
            });
          }

          console.log(`Đã cập nhật phim đang chiếu và diễn viên: ${movie.title} (Trang ${currentPage})`);
        } catch (error) {
          console.error(`Lỗi khi xử lý phim ${movie.title} ở trang ${currentPage}:`, error);
          continue;
        }
      }
      results.push(`Trang ${currentPage}: ${nowPlayingMovies.results.length} phim`);
    }

    res.json({
      success: true,
      message: "Đồng bộ dữ liệu phim đang chiếu và diễn viên thành công",
      details: results
    });
  } catch (error) {
    next(error);
  }
};

// Hàm để đồng bộ cả phim phổ biến và phim đang chiếu
exports.syncAllMovies = async (req, res, next) => {
  try {
    const { page = 1, totalPages = 1 } = req.query;
    const results = {
      popular: [],
      nowPlaying: []
    };

    // Đồng bộ phim phổ biến
    for (let currentPage = page; currentPage <= totalPages; currentPage++) {
      const popularMovies = await tmdbApi.getPopularMovies(currentPage);
      const nowPlayingMovies = await tmdbApi.getNowPlaying(currentPage);
      
      console.log(`Đang xử lý trang ${currentPage}/${totalPages}`);

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
              isPopular: movie.isPopular || false,
              nowPlaying: movie.nowPlaying || false,
              genres: movieDetails.genres,
              videos: movieDetails.videos,
              cast: movieDetails.cast,
              directors: movieDetails.directors,
              lastUpdated: new Date(),
            },
            { upsert: true, new: true }
          );

          // Cập nhật movies trong bảng Actor cho cast
          for (const castMember of movieDetails.cast) {
            await Actor.findByIdAndUpdate(castMember.actor, {
              $addToSet: {
                movies: {
                  movie: updatedMovie._id,
                  character: castMember.character,
                  order: castMember.order,
                },
              },
            });
          }

          // Cập nhật movies trong bảng Actor cho directors
          for (const directorId of movieDetails.directors) {
            await Actor.findByIdAndUpdate(directorId, {
              $addToSet: {
                movies: {
                  movie: updatedMovie._id,
                  character: "Director",
                  order: 0,
                },
              },
            });
          }

          console.log(`Đã cập nhật phim và diễn viên: ${movie.title}`);

          // Thêm delay để tránh rate limit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Lỗi khi xử lý phim ${movie.title}:`, error);
          continue;
        }
      }
      results.popular.push(`Trang ${currentPage}: ${popularMovies.results.length} phim phổ biến`);
      results.nowPlaying.push(`Trang ${currentPage}: ${nowPlayingMovies.results.length} phim đang chiếu`);
    }

    res.json({
      success: true,
      message: "Đồng bộ tất cả dữ liệu phim và diễn viên thành công",
      details: results
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
      Movie.find().sort({ popularity: -1 }).skip(skip).limit(limit),
      Movie.countDocuments(),
    ]);

    res.json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết phim
exports.getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Đang tìm phim với ID:", id);

    // Check if id is MongoDB ObjectId
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    
    // Find movie by either MongoDB _id or tmdbId
    const movie = await Movie.findOne(
      isMongoId ? { _id: id } : { tmdbId: id }
    )
      .populate("cast.actor", "name profilePath")
      .populate("directors", "name profilePath");

    if (!movie) {
      return next(new ErrorResponse("Không tìm thấy phim", 404));
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Lỗi:", error);
    next(error);
  }
};

// Tìm kiếm phim
exports.searchMovies = async (req, res, next) => {
  try {
    const { keyword, genre, year, rating, page = 1, limit = 10 } = req.query;

    // Xây dựng query
    let query = {};

    // Tìm theo keyword
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { overview: { $regex: keyword, $options: "i" } },
      ];
    }

    // Lọc theo thể loại
    if (genre) {
      query["genres.name"] = { $regex: genre, $options: "i" };
    }

    // Lọc theo năm
    if (year) {
      query.releaseDate = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    // Lọc theo rating
    if (rating) {
      query.voteAverage = { $gte: Number(rating) };
    }

    // Thực hiện tìm kiếm với phân trang
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find(query).sort({ popularity: -1 }).skip(skip).limit(limit),
      Movie.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// API cập nhật thông tin phim
exports.updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, overview, voteAverage } = req.body;

    // Check if id is MongoDB ObjectId
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    
    // Find movie by either MongoDB _id or tmdbId
    const movie = await Movie.findOne(
      isMongoId ? { _id: id } : { tmdbId: id }
    );

    if (!movie) {
      return next(new ErrorResponse("Không tìm thấy phim", 404));
    }

    // Update movie
    const updatedMovie = await Movie.findOneAndUpdate(
      isMongoId ? { _id: id } : { tmdbId: id },
      {
        $set: {
          title: title || movie.title,
          overview: overview || movie.overview,
          voteAverage: voteAverage || movie.voteAverage,
          lastUpdated: new Date(),
        },
      },
      { new: true }
    ).populate("cast.actor", "name profilePath")
     .populate("directors", "name profilePath");

    res.json({
      success: true,
      data: updatedMovie,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa phim
exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if id is MongoDB ObjectId
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    
    // Tìm phim bằng _id hoặc tmdbId
    const movie = await Movie.findOne(
      isMongoId ? { _id: id } : { tmdbId: id }
    );

    if (!movie) {
      return next(new ErrorResponse("Không tìm thấy phim", 404));
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
      { "movies.movie": movie._id },
      { $pull: { movies: { movie: movie._id } } }
    );

    // Xóa file trên Google Drive nếu có
    if (movie.googleDrive?.fileId) {
      try {
        await googleDriveService.deleteFile(movie.googleDrive.fileId);
      } catch (error) {
        console.error('Lỗi khi xóa file từ Google Drive:', error);
      }
    }

    // Xóa phim
    await Movie.deleteOne({ _id: movie._id });

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Cấu hình multer để upload file tạm thởi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/temp");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `movie-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000 * 1024 * 1024 }, // Giới hạn 2GB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file video"), false);
    }
  },
});

// API upload phim lên Google Drive
exports.uploadMovieFile = async (req, res, next) => {
  try {
    upload.single("movieFile")(req, res, async function (err) {
      if (err) {
        return next(new Error(`Lỗi upload: ${err.message}`));
      }

      if (!req.file) {
        return next(new Error("Vui lòng chọn file video"));
      }

      const { id } = req.params;
      const movie = await Movie.findOne({ tmdbId: id });

      if (!movie) {
        return next(new Error("Không tìm thấy phim"));
      }

      // Đường dẫn file tạm
      const filePath = req.file.path;
      const fileName = `${movie.title} (${movie.tmdbId})`;

      try {
        // Lấy ID thư mục WebMovie từ biến môi trường
        const webMovieFolderId = process.env.GOOGLE_DRIVE_MOVIE_FOLDER_ID;

        // Kiểm tra xem phim đã có file video trên Google Drive chưa
        if (movie.googleDrive && movie.googleDrive.fileId) {
          try {
            // Xóa file cũ trước khi upload file mới
            await googleDriveService.deleteFile(movie.googleDrive.fileId);
            console.log(`Đã xóa file cũ: ${movie.googleDrive.fileId}`);
          } catch (deleteError) {
            console.error(`Không thể xóa file cũ: ${deleteError.message}`);
            // Tiếp tục upload file mới ngay cả khi không xóa được file cũ
          }
        }

        // Upload lên Google Drive trong thư mục WebMovie
        const driveResult = await googleDriveService.uploadFile(
          filePath,
          fileName,
          webMovieFolderId
        );

        // Cập nhật thông tin video trong database
        movie.googleDrive = {
          fileId: driveResult.fileId,
          embedUrl: driveResult.embedUrl,
          uploadedAt: new Date(),
        };

        await movie.save();

        // Xóa file tạm
        fs.unlinkSync(filePath);

        res.status(200).json({
          success: true,
          data: {
            message: "Upload phim thành công",
            movieId: movie.tmdbId,
            embedUrl: driveResult.embedUrl,
          },
        });
      } catch (error) {
        // Xóa file tạm nếu có lỗi
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw error;
      }
    });
  } catch (error) {
    next(error);
  }
};

// API để lấy URL embed của phim
exports.getMovieEmbedUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findOne({ tmdbId: id });

    if (!movie) {
      return next(new Error("Không tìm thấy phim"));
    }

    // Kiểm tra xem phim có sẵn trên Google Drive không
    if (movie.googleDrive && movie.googleDrive.embedUrl) {
      return res.json({
        success: true,
        data: {
          embedUrl: movie.googleDrive.embedUrl,
          title: movie.title,
        },
      });
    }

    // Nếu không có video nào
    return next(new Error("Phim này chưa có file video"));
  } catch (error) {
    next(error);
  }
};

// API để lấy phim tương tự
exports.getSimilarMovies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    // Tìm phim gốc
    const movie = await Movie.findById(id);
    if (!movie) {
      return next(new ErrorResponse("Không tìm thấy phim", 404));
    }

    // Lấy ID của các thể loại từ phim gốc
    const genreIds = movie.genres.map(genre => genre.id);

    // Tìm các phim có thể loại tương tự
    const similarMovies = await Movie.aggregate([
      {
        $match: {
          _id: { $ne: movie._id }, // Loại trừ phim hiện tại
          'genres.id': { $in: genreIds } // Tìm phim có ít nhất 1 thể loại trùng khớp
        }
      },
      {
        $addFields: {
          matchingGenres: {
            $size: {
              $setIntersection: [
                '$genres.id',
                genreIds
              ]
            }
          }
        }
      },
      {
        $sort: {
          matchingGenres: -1, // Sắp xếp theo số lượng thể loại trùng khớp
          voteAverage: -1 // Sau đó sắp xếp theo điểm đánh giá
        }
      },
      {
        $limit: limit
      }
    ]);

    res.json({
      success: true,
      data: similarMovies
    });
  } catch (error) {
    next(error);
  }
};