import api from './index';

// Types
export interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  updatedAt: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  isPopular: boolean;
  nowPlaying: boolean;
  // Add the googleDrive property
  googleDrive?: {
    fileId: string;
    embedUrl: string;
    uploadedAt: string;
  };
  genres: {
    id: number;
    name: string;
  }[];
  videos: {
    key: string;
    name: string;
    site: string;
    type: string;
  }[];
  cast: {
    actor: {
      _id: string;
      tmdbId: number;
      name: string;
      profilePath: string;
    };
    character: string;
    order: number;
  }[];
  directors: {
    _id: string;
    tmdbId: number;
    name: string;
    profilePath: string;
  }[];
}

export interface MovieResponse {
  success: boolean;
  data: Movie[];
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  page?: number;
  totalResults?: number;
}

export interface MovieDetailResponse {
  success: boolean;
  data: Movie;
}

export interface UpdateMovieData {
  title?: string;
  overview?: string;
  voteAverage?: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface TMDBMovieResponse {
  success: boolean;
  page: number;
  totalPages: number;
  totalResults: number;
  data: TMDBMovie[];
}

// Lấy danh sách phim (từ database)
export const getMovies = async (page = 1, limit = 10) => {
  return api.get<MovieResponse>(`/movies?page=${page}&limit=${limit}`);
};

// Lấy chi tiết phim
export const getMovieDetails = async (id: string | number) => {
  return api.get<MovieDetailResponse>(`/movies/${id}`);
};

// Tìm kiếm phim
export const searchMovies = async (params: {
  keyword?: string;
  genre?: string;
  year?: string;
  rating?: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.genre) queryParams.append('genre', params.genre);
  if (params.year) queryParams.append('year', params.year);
  if (params.rating) queryParams.append('rating', params.rating);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  return api.get<MovieResponse>(`/movies/search?${queryParams.toString()}`);
};

// Đồng bộ phim phổ biến từ TMDB (chỉ cho admin)
export const syncPopularMovies = async (page = 1, totalPages = 1) => {
  return api.post('/movies/sync-popular', {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    params: { page, totalPages }
  });
};

// Đồng bộ phim đang chiếu từ TMDB (chỉ cho admin)
export const syncNowPlayingMovies = async (page = 1, totalPages = 1) => {
  return api.post('/movies/sync-now-playing', {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    params: { page, totalPages }
  });
};

// Đồng bộ tất cả phim từ TMDB (chỉ cho admin)
export const syncAllMovies = async (page = 1, totalPages = 1) => {
  return api.post('/movies/sync-all', {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    params: { page, totalPages }
  });
};

// Cập nhật thông tin phim (chỉ cho admin)
export const updateMovie = async (id: string, data: Partial<Movie>) => {
  return api.put<{
    success: boolean;
    data: Movie;
  }>(`/movies/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
};

// Delete movie (admin only)
export const deleteMovie = async (id: string | number) => {
  return api.delete<{
    success: boolean;
    data: {};
  }>(`/movies/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
};

// Upload phim lên Google Drive (admin)
export const uploadMovieFile = async (id: string, formData: FormData) => {
  return api.post<{
    success: boolean;
    data: {
      message: string;
      movieId: number;
      embedUrl: string;
    };
  }>(`/movies/${id}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Lấy danh sách phim liên quan
export const getSimilarMovies = async (movieId: string, limit = 4) => {
  return api.get<MovieResponse>(`/movies/${movieId}/similar?limit=${limit}`);
};