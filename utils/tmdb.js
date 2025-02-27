const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY không được định nghĩa trong biến môi trường');
}

const tmdbApi = {

    // Lấy chi tiết phim
    getMovieDetails: async (movieId) => {
        try {
            // Gọi 2 API riêng biệt
            const [movieResponse, videosResponse] = await Promise.all([
                axios.get(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=vi-VN`),
                axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`)
            ]);

            console.log('Video response:', videosResponse.data);

            // Lọc trailer từ response
            const trailers = videosResponse.data.results.filter(
                video => video.site === 'YouTube' && 
                (video.type === 'Trailer' || video.type === 'Teaser')
            );

            console.log('Filtered trailers:', trailers);

            // Kết hợp thông tin phim và trailers
            return {
                ...movieResponse.data,
                videos: trailers.map(trailer => ({
                    key: trailer.key,
                    name: trailer.name,
                    site: trailer.site,
                    type: trailer.type
                }))
            };
        } catch (error) {
            console.error('Lỗi chi tiết:', error.response ? error.response.data : error.message);
            throw new Error(`Không thể lấy thông tin chi tiết phim: ${error.message}`);
        }
    },

    // Lấy danh sách phim phổ biến
    getPopularMovies: async (page = 1) => {
        try {
            console.log('Đang gọi TMDB API với key:', TMDB_API_KEY);
            const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=vi-VN&page=${page}`;
            console.log('URL request:', url);

            const response = await axios.get(url);
            
            if (response.data.results) {
                console.log(`Lấy thành công ${response.data.results.length} phim`);
                return response.data;
            } else {
                throw new Error('Không có dữ liệu phim trong response');
            }
        } catch (error) {
            console.error('Lỗi chi tiết:', error.response ? error.response.data : error.message);
            throw new Error(`Không thể lấy danh sách phim phổ biến: ${error.message}`);
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
            console.error('Lỗi chi tiết:', error.response ? error.response.data : error.message);
            throw new Error(`Không thể lấy danh sách phim đang chiếu: ${error.message}`);
        }
    },

};

module.exports = tmdbApi; 