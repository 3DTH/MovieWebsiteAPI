"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMovieComments,
  addComment,
  updateComment,
  deleteComment,
  Comment,
} from "@/app/api/commentApi";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface CommentSectionProps {
  movieId: string;
  tmdbId: number; // Thêm prop này
}

export default function CommentSection({
  movieId,
  tmdbId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [hasUserCommented, setHasUserCommented] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Add this useEffect to fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, [tmdbId]); // Re-fetch when tmdbId changes

  // Check if user has already commented when comments load
  useEffect(() => {
    if (user && comments.length > 0) {
      const userComment = comments.find(
        (comment) => comment.user._id === user.id
      );
      setHasUserCommented(!!userComment);
    } else {
      setHasUserCommented(false); // Reset when user logs out
    }
  }, [comments, user]);

  // Sử dụng tmdbId thay vì movieId
  const fetchComments = async () => {
    try {
      const response = await getMovieComments(tmdbId.toString());
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    if (hasUserCommented) {
      toast.error("Bạn đã bình luận cho bộ phim này rồi!");
      return;
    }

    try {
      setLoading(true);
      await addComment(tmdbId.toString(), newComment);
      setNewComment("");
      await fetchComments();
      toast.success("Bình luận của bạn đã được thêm thành công!");
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error("Bạn đã bình luận cho bộ phim này rồi!");
      } else {
        toast.error("Có lỗi xảy ra khi thêm bình luận!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(movieId, commentId);
      await fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Add edit comment handler
  const handleEditComment = async (
    commentId: string,
    currentContent: string
  ) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  // Add save edit handler
  const handleSaveEdit = async (commentId: string) => {
    try {
      await updateComment(movieId, commentId, editContent);
      await fetchComments();
      setEditingCommentId(null);
      setEditContent("");
      toast.success("Bình luận đã được cập nhật!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật bình luận!");
    }
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm mt-8">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
        Bình luận từ người xem
      </h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        hasUserCommented ? (
          <div className="text-center py-4 bg-gray-700/30 rounded-lg mb-8">
            <p className="text-yellow-400">Bạn đã bình luận cho bộ phim này!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ suy nghĩ của bạn về bộ phim..."
                className="flex-1 bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiSend className="w-5 h-5" />
                <span>Gửi</span>
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="text-center py-6 bg-gray-700/30 rounded-lg mb-8 backdrop-blur-sm">
          <p className="text-gray-300 mb-3">
            Vui lòng đăng nhập để tham gia bình luận
          </p>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Đăng nhập
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-700/30 rounded-lg p-4 backdrop-blur-sm hover:bg-gray-700/40 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                    {comment.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-white flex items-center gap-2">
                      {comment.user.username}
                      {user && user.id === comment.user._id && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          Bạn
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                {user && user.id === comment.user._id && (
                  <div className="flex gap-2">
                    {editingCommentId !== comment._id ? (
                      <>
                        <button
                          onClick={() =>
                            handleEditComment(comment._id, comment.content)
                          }
                          className="text-gray-400 hover:text-blue-500 transition-colors p-2 hover:bg-gray-600/30 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-600/30 rounded-full"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="pl-5 ml-5">
                {editingCommentId === comment._id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSaveEdit(comment._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditContent("");
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-300 leading-relaxed pl-5">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
