import api from './index';

export interface Actor {
  _id: string;
  tmdbId: number;
  name: string;
  profilePath: string;
  biography: string;
  birthday: string;
  placeOfBirth: string;
  popularity: number;
  movies: {
    movie: {
      _id: string;
      tmdbId: number; 
      title: string;
      posterPath: string;
      releaseDate: string;
    };
    character: string;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ActorResponse {
  success: boolean;
  data: Actor;
}

export interface ActorsSearchResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Actor[];
}

// Get actor details by ID
export const getActorDetails = async (id: string): Promise<ActorResponse> => {
  const response = await api.get(`/actors/${id}`);
  return response.data;
};

// Search actors with pagination and keyword
export const searchActors = async (
  page: number = 1,
  limit: number = 10,
  keyword?: string
): Promise<ActorsSearchResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (keyword) {
    params.append('keyword', keyword);
  }

  const response = await api.get(`/actors/search?${params.toString()}`);
  return response.data;
};