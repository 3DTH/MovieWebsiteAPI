import api from './index';
import { Movie } from './movieApi';

// Types
export interface FavoriteResponse {
  success: boolean;
  data: Movie[];
}

export interface SingleFavoriteResponse {
  success: boolean;
  data: Movie;
}

// Get user's favorite movies
export const getFavoriteMovies = async (): Promise<FavoriteResponse> => {
  const response = await api.get('/favorites');
  return response.data;
};

// Add movie to favorites
export const addToFavorites = async (movieId: string): Promise<FavoriteResponse> => {
  const response = await api.post(`/favorites/${movieId}`);
  return response.data;
};

// Remove movie from favorites
export const removeFromFavorites = async (movieId: string): Promise<FavoriteResponse> => {
  const response = await api.delete(`/favorites/${movieId}`);
  return response.data;
};

// Check if a movie is in favorites
export const checkIsFavorite = async (movieId: string): Promise<boolean> => {
  try {
    const favorites = await getFavoriteMovies();
    return favorites.data.some(movie => 
      movie.tmdbId.toString() === movieId || movie._id === movieId
    );
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};