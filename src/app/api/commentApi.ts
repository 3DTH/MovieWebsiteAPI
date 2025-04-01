import api from './index';

// Types
export interface Comment {
  _id: string;
  movie: string;
  user: {
    _id: string;
    username: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  success: boolean;
  data: Comment[];
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface SingleCommentResponse {
  success: boolean;
  data: Comment;
}

// Lấy danh sách comments của một phim
export const getMovieComments = async (movieId: string) => {
  return api.get<CommentResponse>(`/movies/${movieId}/comments`);
};
// Thêm bình luận mới
export const addComment = async (movieId: string, content: string) => {
  return api.post<SingleCommentResponse>(`/movies/${movieId}/comments`, {
    content
  });
};

// Cập nhật bình luận
export const updateComment = async (movieId: string, commentId: string, content: string) => {
  return api.put<SingleCommentResponse>(`/movies/${movieId}/comments/${commentId}`, {
    content
  });
};

// Xóa bình luận
export const deleteComment = async (movieId: string, commentId: string) => {
  return api.delete<{ success: boolean }>(`/movies/${movieId}/comments/${commentId}`);
};
