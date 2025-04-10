const Movie = require("../models/Movie");
const tmdbApi = require("../utils/tmdb");
const Comment = require("../models/Comment");
const Actor = require("../models/Actor");
const User = require("../models/User");
const googleDriveService = require("../services/googleDriveService");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { ErrorResponse } = require("../middleware/error");

// Cập nhật danh sách phim phổ biến
exports.syncPopularMovies = async (req, res, next) => {
  try {
    const { page = 1, totalPages = 1 } = req.query;
    const results = {
      added: [],
      skipped: [],
    };

    for (let currentPage = page; currentPage <= totalPages; currentPage++) {
      const popularMovies = await tmdbApi.getPopularMovies(currentPage);
      console.log(
        `Đang xử lý trang ${currentPage}/${totalPages} của phim phổ biến`
      );

      for (const movie of popularMovies.results) {
        try {
          // Kiểm tra xem phim đã tồn tại chưa
          const existingMovie = await Movie.findOne({ tmdbId: movie.id });

          if (existingMovie) {
            console.log(`Bỏ qua phim đã tồn tại: ${movie.title}`);
            results.skipped.push(movie.title);
            continue;
          }

          // Nếu phim chưa tồn tại, lấy chi tiết và thêm mới
          const movieDetails = await tmdbApi.getMovieDetails(movie.id);

          const newMovie = await Movie.create({
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
          });

          // Cập nhật actors chỉ cho phim mới
          for (const castMember of movieDetails.cast) {
            await Actor.findByIdAndUpdate(castMember.actor, {
              $addToSet: {
                movies: {
                  movie: newMovie._id,
                  character: castMember.character,
                  order: castMember.order,
                },
              },
            });
          }

          // Cập nhật directors chỉ cho phim mới
          for (const directorId of movieDetails.directors) {
            await Actor.findByIdAndUpdate(directorId, {
              $addToSet: {
                movies: {
                  movie: newMovie._id,
                  character: "Director",
                  order: 0,
                },
              },
            });
          }

          results.added.push(movie.title);
          console.log(`Đã thêm phim mới: ${movie.title}`);
        } catch (error) {
          console.error(`Lỗi khi xử lý phim ${movie.title}:`, error);
          continue;
        }
      }
    }

    res.json({
      success: true,
      message: "Đồng bộ dữ liệu phim phổ biến thành công",
      details: {
        added: `Đã thêm ${results.added.length} phim mới`,
        skipped: `Đã bỏ qua ${results.skipped.length} phim đã tồn tại`,
        addedMovies: results.added,
        skippedMovies: results.skipped,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật danh sách phim đang chiếu
exports.syncNowPlayingMovies = async (req, res, next) => {
  try {
    const { page = 1, totalPages = 1 } = req.query;
    const results = {
      added: [],
      skipped: [],
    };

    for (let currentPage = page; currentPage <= totalPages; currentPage++) {
      const nowPlayingMovies = await tmdbApi.getNowPlaying(currentPage);
      console.log(
        `Đang xử lý trang ${currentPage}/${totalPages} của phim đang chiếu`
      );

      for (const movie of nowPlayingMovies.results) {
        try {
          // Kiểm tra xem phim đã tồn tại chưa
          const existingMovie = await Movie.findOne({ tmdbId: movie.id });

          if (existingMovie) {
            console.log(`Bỏ qua phim đã tồn tại: ${movie.title}`);
            results.skipped.push(movie.title);
            continue;
          }

          // Nếu phim chưa tồn tại, lấy chi tiết và thêm mới
          const movieDetails = await tmdbApi.getMovieDetails(movie.id);

          const newMovie = await Movie.create({
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
            nowPlaying: true,
            genres: movieDetails.genres,
            videos: movieDetails.videos,
            cast: movieDetails.cast,
            directors: movieDetails.directors,
            lastUpdated: new Date(),
          });

          // Cập nhật actors chỉ cho phim mới
          for (const castMember of movieDetails.cast) {
            await Actor.findByIdAndUpdate(castMember.actor, {
              $addToSet: {
                movies: {
                  movie: newMovie._id,
                  character: castMember.character,
                  order: castMember.order,
                },
              },
            });
          }

          // Cập nhật directors chỉ cho phim mới
          for (const directorId of movieDetails.directors) {
            await Actor.findByIdAndUpdate(directorId, {
              $addToSet: {
                movies: {
                  movie: newMovie._id,
                  character: "Director",
                  order: 0,
                },
              },
            });
          }

          results.added.push(movie.title);
          console.log(`Đã thêm phim mới: ${movie.title}`);
        } catch (error) {
          console.error(`Lỗi khi xử lý phim ${movie.title}:`, error);
          continue;
        }
      }
    }

    res.json({
      success: true,
      message: "Đồng bộ dữ liệu phim đang chiếu thành công",
      details: {
        added: `Đã thêm ${results.added.length} phim mới`,
        skipped: `Đã bỏ qua ${results.skipped.length} phim đã tồn tại`,
        addedMovies: results.added,
        skippedMovies: results.skipped,
      },
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
      popular: { added: [], skipped: [] },
      nowPlaying: { added: [], skipped: [] },
    };

    for (let currentPage = page; currentPage <= totalPages; currentPage++) {
      const popularMovies = await tmdbApi.getPopularMovies(currentPage);
      const nowPlayingMovies = await tmdbApi.getNowPlaying(currentPage);

      console.log(`Đang xử lý trang ${currentPage}/${totalPages}`);

      // Đồng bộ phim phổ biến
      for (const movie of popularMovies.results) {
        try {
          const existingMovie = await Movie.findOne({ tmdbId: movie.id });

          if (existingMovie) {
            console.log(`Bỏ qua phim phổ biến đã tồn tại: ${movie.title}`);
            results.popular.skipped.push(movie.title);
            continue;
          }

          const movieDetails = await tmdbApi.getMovieDetails(movie.id);

          const newMovie = await Movie.create({
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
          });

          // Cập nhật actors cho phim phổ biến
          for (const castMember of movieDetails.cast) {
            await Actor.findByIdAndUpdate(castMember.actor, {
              $addToSet: {
                movies: {
                  movie: newMovie._id,
                  character: castMember.character,
                  order: castMember.order,
                },
              },
            });
          }

          // Cập nhật directors cho phim phổ biến
          for (const directorId of movieDetails.directors) {
            await Actor.findByIdAndUpdate(directorId, {
              $addToSet: {
                movies: {
                  movie: newMovie._id,
                  character: "Director",
                  order: 0,
                },
              },
            });
          }

          results.popular.added.push(movie.title);
          console.log(`Đã thêm phim phổ biến mới: ${movie.title}`);
        } catch (error) {
          console.error(`Lỗi khi xử lý phim phổ biến ${movie.title}:`, error);
          continue;
        }
      }

      // Đồng bộ phim đang chiếu
      for (const movie of nowPlayingMovies.results) {
        try {
          const existingMovie = await Movie.findOne({ tmdbId: movie.id });

          if (existingMovie) {
            console.log(`Bỏ qua phim đang chiếu đã tồn tại: ${movie.title}`);
            results.nowPlaying.skipped.push(movie.title);
            continue;
          }

          const movieDetails = await tmdbApi.getMovieDetails(movie.id);

          const newMovie = await Movie.create({
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
            nowPlaying: true,
            genres: movieDetails.genres,
            videos: movieDetails.videos,
            cast: movieDetails.cast,
            directors: movieDetails.directors,
            lastUpdated: new Date(),
          });

          // Cập nhật actors cho phim mới
          for (const castMember of movieDetails.cast) {
            await Actor.findByIdAndUpdate(castMember.actor, {
              $addToSet: {
                movies: {
                  movie: newMovie._id,
                  character: castMember.character,
                  order: castMember.order,
                },
              },
            });
          }

          // Cập nhật directors cho phim mới
          for (const directorId of movieDetails.directors) {
            await Actor.findByIdAndUpdate(directorId, {
              $addToSet: {
                movies: {
                  movie: newMovie._id,
                  character: "Director",
                  order: 0,
                },
              },
            });
          }

          results.nowPlaying.added.push(movie.title);
          console.log(`Đã thêm phim đang chiếu mới: ${movie.title}`);

          // Add delay to avoid rate limit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Lỗi khi xử lý phim đang chiếu ${movie.title}:`, error);
          continue;
        }
      }
    }

    res.json({
      success: true,
      message: "Đồng bộ tất cả dữ liệu phim thành công",
      details: {
        popular: {
          added: `Đã thêm ${results.popular.added.length} phim phổ biến mới`,
          skipped: `Đã bỏ qua ${results.popular.skipped.length} phim phổ biến đã tồn tại`,
          addedMovies: results.popular.added,
          skippedMovies: results.popular.skipped,
        },
        nowPlaying: {
          added: `Đã thêm ${results.nowPlaying.added.length} phim đang chiếu mới`,
          skipped: `Đã bỏ qua ${results.nowPlaying.skipped.length} phim đang chiếu đã tồn tại`,
          addedMovies: results.nowPlaying.added,
          skippedMovies: results.nowPlaying.skipped,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách phim
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
    const movie = await Movie.findOne(isMongoId ? { _id: id } : { tmdbId: id })
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
    let query = {};

    if (keyword) {
      // Normalize the search keyword
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .trim()
        .replace(/\s+/g, " ");

      // Split into words and filter out short words
      const keywords = normalizedKeyword
        .split(/\s+/)
        .filter((word) => word.length > 1)
        .map(word => word.replace(/[0-9]/g, ""));

      if (keywords.length > 0) {
        query.$or = [
          // Match exact phrase
          {
            title: {
              $regex: normalizedKeyword,
              $options: "i",
            },
          },
          {
            originalTitle: {
              $regex: normalizedKeyword,
              $options: "i",
            },
          },
          {
            overview: {
              $regex: normalizedKeyword,
              $options: "i",
            },
          },
          // Match individual words
          {
            $and: keywords.map((word) => ({
              $or: [
                { title: { $regex: word, $options: "i" } },
                { originalTitle: { $regex: word, $options: "i" } },
                { overview: { $regex: word, $options: "i" } },
              ],
            })),
          },
        ];
      }
    }

    // Rest of the filtering logic
    if (genre) {
      query["genres.name"] = { $regex: genre, $options: "i" };
    }

    if (year) {
      query.releaseDate = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    if (rating) {
      query.voteAverage = { $gte: Number(rating) };
    }

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

// API thêm phim mới
exports.addMovie = async (req, res, next) => {
  try {
    const {
      tmdbId,
      title,
      originalTitle,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      voteAverage,
      voteCount,
      popularity,
      isPopular,
      nowPlaying,
      genres,
      videos,
      cast,
      directors,
    } = req.body;

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ tmdbId });
    if (existingMovie) {
      return next(new ErrorResponse("Movie already exists", 400));
    }

    const movie = await Movie.create({
      tmdbId,
      title,
      originalTitle,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      voteAverage,
      voteCount,
      popularity,
      isPopular: isPopular || false,
      nowPlaying: nowPlaying || false,
      genres: genres || [],
      videos: videos || [],
      cast: cast || [],
      directors: directors || [],
      lastUpdated: new Date(),
    });

    // If there are cast members, update their movies list
    if (cast && cast.length > 0) {
      for (const castMember of cast) {
        await Actor.findByIdAndUpdate(castMember.actor._id, {
          $addToSet: {
            movies: {
              movie: movie._id,
              character: castMember.character,
              order: castMember.order,
            },
          },
        });
      }
    }

    // If there are directors, update their movies list
    if (directors && directors.length > 0) {
      for (const director of directors) {
        await Actor.findByIdAndUpdate(director._id, {
          $addToSet: {
            movies: {
              movie: movie._id,
              character: "Director",
              order: 0,
            },
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      data: movie,
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
    const movie = await Movie.findOne(isMongoId ? { _id: id } : { tmdbId: id });

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
    )
      .populate("cast.actor", "name profilePath")
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
    const movie = await Movie.findOne(isMongoId ? { _id: id } : { tmdbId: id });

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
        console.error("Lỗi khi xóa file từ Google Drive:", error);
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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000 * 1024 * 1024 }, // 5GB limit
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
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

      const movie = await Movie.findOne(
        isMongoId ? { _id: id } : { tmdbId: parseInt(id) }
      );

      if (!movie) {
        return next(new Error("Không tìm thấy phim"));
      }

      const fileName = `${movie.title} (${movie.tmdbId})`;

      try {
        const webMovieFolderId = process.env.GOOGLE_DRIVE_MOVIE_FOLDER_ID;

        if (movie.googleDrive?.fileId) {
          try {
            await googleDriveService.deleteFile(movie.googleDrive.fileId);
            console.log(`Đã xóa file cũ: ${movie.googleDrive.fileId}`);
          } catch (deleteError) {
            console.error(`Không thể xóa file cũ: ${deleteError.message}`);
          }
        }

        // Sử dụng buffer
        const driveResult = await googleDriveService.uploadFileFromBuffer(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          webMovieFolderId
        );

        movie.googleDrive = {
          fileId: driveResult.fileId,
          embedUrl: driveResult.embedUrl,
          uploadedAt: new Date(),
        };

        await movie.save();

        res.status(200).json({
          success: true,
          data: {
            message: "Upload phim thành công",
            movieId: movie.tmdbId,
            embedUrl: driveResult.embedUrl,
          },
        });
      } catch (error) {
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

// API lấy phim tương tự
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
    const genreIds = movie.genres.map((genre) => genre.id);

    // Tìm các phim có thể loại tương tự
    const similarMovies = await Movie.aggregate([
      {
        $match: {
          _id: { $ne: movie._id },
          "genres.id": { $in: genreIds },
        },
      },
      {
        $addFields: {
          matchingGenres: {
            $size: {
              $setIntersection: ["$genres.id", genreIds],
            },
          },
        },
      },
      {
        $sort: {
          matchingGenres: -1,
          voteAverage: -1,
        },
      },
      {
        $limit: limit,
      },
    ]);

    res.json({
      success: true,
      data: similarMovies,
    });
  } catch (error) {
    next(error);
  }
};

// API lọc phim
exports.getFilteredMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Handle keyword search
    if (req.query.keyword) {
      query.title = { $regex: req.query.keyword, $options: "i" };
    }

    // Handle genre filtering
    if (req.query.genres) {
      query["genres.id"] = parseInt(req.query.genres);
    }

    // Handle year filtering
    if (req.query.year) {
      const year = parseInt(req.query.year);
      if (!isNaN(year)) {
        query.releaseDate = {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        };
      }
    }

    // Handle country filtering
    if (req.query.country) {
      query.country = req.query.country;
    }

    // Handle version/language filtering
    if (req.query.version) {
      query.version = req.query.version;
    }

    // Get total count and filtered movies
    const total = await Movie.countDocuments(query);

    // Apply sorting
    let sortOption = {};
    switch (req.query.sort) {
      case "newest":
        sortOption = { releaseDate: -1 };
        break;
      case "popular":
        sortOption = { popularity: -1 };
        break;
      case "rating":
        sortOption = { voteAverage: -1 };
        break;
      case "name-asc":
        sortOption = { title: 1 };
        break;
      case "name-desc":
        sortOption = { title: -1 };
        break;
      default:
        sortOption = { releaseDate: -1 }; // Default sort by newest
    }

    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: movies,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Filter error:", error);
    next(error);
  }
};

// Lọc phim nâng cao
// exports.filterMovies = async (req, res, next) => {
//   try {
//     const {
//       keyword,
//       genres,
//       year,
//       country,
//       rating,
//       type,
//       version,
//       sort = 'newest',
//       page = 1,
//       limit = 20
//     } = req.query;

//     // Build query object
//     let query = {};

//     // Keyword search
//     if (keyword) {
//       query.$or = [
//         { title: { $regex: keyword, $options: 'i' } },
//         { overview: { $regex: keyword, $options: 'i' } }
//       ];
//     }

//     // Genre filter
//     if (genres && genres !== 'all') {
//       query['genres.name'] = { $regex: genres, $options: 'i' };
//     }

//     // Year filter
//     if (year && year !== 'all') {
//       query.releaseDate = {
//         $gte: new Date(`${year}-01-01`),
//         $lte: new Date(`${year}-12-31`)
//       };
//     }

//     // Rating filter
//     if (rating && rating !== 'all') {
//       query.voteAverage = { $gte: parseFloat(rating) };
//     }

//     // Type filter (popular/new/etc)
//     if (type && type !== 'all') {
//       switch (type) {
//         case 'popular':
//           query.isPopular = true;
//           break;
//         case 'nowPlaying':
//           query.nowPlaying = true;
//           break;
//         case 'topRated':
//           query.voteAverage = { $gte: 7.5 };
//           break;
//       }
//     }

//     // Determine sort order
//     let sortQuery = {};
//     switch (sort) {
//       case 'newest':
//         sortQuery = { releaseDate: -1 };
//         break;
//       case 'oldest':
//         sortQuery = { releaseDate: 1 };
//         break;
//       case 'nameAsc':
//         sortQuery = { title: 1 };
//         break;
//       case 'nameDesc':
//         sortQuery = { title: -1 };
//         break;
//       case 'ratingDesc':
//         sortQuery = { voteAverage: -1 };
//         break;
//       case 'popularityDesc':
//         sortQuery = { popularity: -1 };
//         break;
//       default:
//         sortQuery = { releaseDate: -1 };
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Execute query with pagination
//     const [movies, total] = await Promise.all([
//       Movie.find(query)
//         .sort(sortQuery)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Movie.countDocuments(query)
//     ]);

//     // Return response with filter parameters in metadata
//     res.json({
//       success: true,
//       metadata: {
//         filters: {
//           keyword,
//           genres,
//           year,
//           country,
//           rating,
//           type,
//           version,
//           sort
//         },
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           totalPages: Math.ceil(total / parseInt(limit))
//         }
//       },
//       data: movies
//     });

//   } catch (error) {
//     next(error);
//   }
// };
