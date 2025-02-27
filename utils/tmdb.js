const axios = require("axios");
const Actor = require("../models/Actor");
const Movie = require("../models/Movie");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY không được định nghĩa trong biến môi trường");
}

const tmdbApi = {
  // Lấy chi tiết phim
  getMovieDetails: async (movieId) => {
    try {
      const [movieResponse, videosResponse, creditsResponse] =
        await Promise.all([
          axios.get(
            `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=vi-VN`
          ),
          axios.get(
            `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
          ),
          axios.get(
            `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=vi-VN`
          ),
        ]);

      console.log("Video response:", videosResponse.data);

      // Lọc trailer từ response
      const trailers = videosResponse.data.results.filter(
        (video) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      );

      console.log("Filtered trailers:", trailers);

      // Xử lý cast và lưu vào Actor collection
      const castPromises = creditsResponse.data.cast.slice(0, 10).map(async actor => {
        // Tìm hoặc tạo actor trong database
        const actorDetails = await getActorDetails(actor.id);
        const existingActor = await Actor.findOne({ tmdbId: actor.id });
        
        let savedActor;
        if (existingActor) {
            savedActor = existingActor;
        } else {
            savedActor = await Actor.create(actorDetails);
        }

        // Tìm movie trong database bằng tmdbId
        const movieInDb = await Movie.findOne({ tmdbId: movieResponse.data.id });
        if (!movieInDb) {
            throw new Error(`Không tìm thấy phim với tmdbId: ${movieResponse.data.id}`);
        }

        // Cập nhật movies trong Actor với ObjectId của movie
        await Actor.findByIdAndUpdate(
            savedActor._id,
            {
                $addToSet: {
                    movies: {
                        movie: movieInDb._id, // Sử dụng ObjectId thay vì tmdbId
                        character: actor.character,
                        order: actor.order
                    }
                }
            }
        );

        return {
            actor: savedActor._id,
            character: actor.character,
            order: actor.order
        };
      });

      // Xử lý directors
      const directorPromises = creditsResponse.data.crew
        .filter((crew) => crew.job === "Director")
        .map(async (director) => {
          const directorDetails = await getActorDetails(director.id);
          const existingDirector = await Actor.findOne({ tmdbId: director.id });

          let savedDirector;
          if (existingDirector) {
            savedDirector = existingDirector;
          } else {
            savedDirector = await Actor.create(directorDetails);
          }

          return savedDirector._id;
        });

      // Đợi tất cả promises hoàn thành
      const [cast, directors] = await Promise.all([
        Promise.all(castPromises),
        Promise.all(directorPromises),
      ]);

      // Kết hợp thông tin phim và trailers
      return {
        ...movieResponse.data,
        videos: trailers.map((trailer) => ({
          key: trailer.key,
          name: trailer.name,
          site: trailer.site,
          type: trailer.type,
        })),
        cast,
        directors,
      };
    } catch (error) {
      console.error("Lỗi chi tiết:", error);
      throw new Error(
        `Không thể lấy thông tin chi tiết phim: ${error.message}`
      );
    }
  },

  // Lấy danh sách phim phổ biến
  getPopularMovies: async (page = 1) => {
    try {
      console.log("Đang gọi TMDB API với key:", TMDB_API_KEY);
      const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=vi-VN&page=${page}`;
      console.log("URL request:", url);

      const response = await axios.get(url);

      if (response.data.results) {
        console.log(`Lấy thành công ${response.data.results.length} phim`);
        return response.data;
      } else {
        throw new Error("Không có dữ liệu phim trong response");
      }
    } catch (error) {
      console.error(
        "Lỗi chi tiết:",
        error.response ? error.response.data : error.message
      );
      throw new Error(
        `Không thể lấy danh sách phim phổ biến: ${error.message}`
      );
    }
  },

  // Lấy phim đang chiếu
  getNowPlaying: async (page = 1) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=vi-VN&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi chi tiết:",
        error.response ? error.response.data : error.message
      );
      throw new Error(
        `Không thể lấy danh sách phim đang chiếu: ${error.message}`
      );
    }
  },

  getMovieCredits: async (movieId) => {
    try {
      const url = `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=vi-VN`;
      console.log("Đang lấy thông tin diễn viên cho phim:", movieId);

      const response = await axios.get(url);

      // Lọc và giới hạn số lượng diễn viên (ví dụ: 10 người đầu)
      const cast = response.data.cast.slice(0, 10).map((actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path,
        order: actor.order,
      }));

      // Lọc đạo diễn từ crew
      const directors = response.data.crew
        .filter((crew) => crew.job === "Director")
        .map((director) => ({
          id: director.id,
          name: director.name,
          job: director.job,
          profilePath: director.profile_path,
        }));

      return {
        cast,
        directors,
      };
    } catch (error) {
      console.error(
        "Lỗi chi tiết:",
        error.response ? error.response.data : error.message
      );
      throw new Error(`Không thể lấy thông tin diễn viên: ${error.message}`);
    }
  },
};

// Thêm hàm mới để lấy chi tiết diễn viên
const getActorDetails = async (actorId) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/person/${actorId}?api_key=${TMDB_API_KEY}&language=vi-VN`
    );
    return {
      tmdbId: response.data.id,
      name: response.data.name,
      biography: response.data.biography,
      profilePath: response.data.profile_path,
      birthday: response.data.birthday,
      placeOfBirth: response.data.place_of_birth,
      popularity: response.data.popularity,
    };
  } catch (error) {
    throw new Error(`Không thể lấy thông tin diễn viên: ${error.message}`);
  }
};

module.exports = {
  ...tmdbApi,
  getActorDetails,
};
