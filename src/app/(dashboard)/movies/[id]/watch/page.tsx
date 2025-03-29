"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMovieDetails, Movie, getSimilarMovies } from "@/app/api/movieApi";
import CommentSection from "@/components/comments/CommentSection";
import {
  FiArrowLeft,
  FiMaximize,
  FiMinimize,
  FiClock,
  FiCalendar,
  FiStar,
  FiHeart,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export default function WatchMovie() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lấy dự liệu phim dựa trên movieId
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const response = await getMovieDetails(movieId);

        if (response.data.success) {
          setMovie(response.data.data);

          // Redirect if no embed URL
          if (
            !response.data.data.googleDrive ||
            !response.data.data.googleDrive.embedUrl
          ) {
            router.push(`/movies/${movieId}`);
          }
        } else {
          setError("Không thể tải thông tin phim");
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin phim:", err);
        setError("Đã xảy ra lỗi khi tải phim");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId, router]);

  // Tự động ẩn điều khiển sau một khoảng thời gian
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!movie) return;
      try {
        const response = await getSimilarMovies(movie._id);
        if (response.data.success) {
          setSimilarMovies(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching similar movies:", error);
      }
    };

    fetchSimilarMovies();
  }, [movie]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerContainerRef.current) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Không thể vào chế độ toàn màn hình: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Hàm lấy URL video an toàn
  const getVideoUrl = () => {
    if (!movie || !movie.googleDrive) return "";

    // Ưu tiên sử dụng fileId nếu có
    if (movie.googleDrive.fileId) {
      return `https://drive.google.com/file/d/${movie.googleDrive.fileId}/preview`;
    }

    // Nếu không có embedUrl, trả về chuỗi rỗng
    if (!movie.googleDrive.embedUrl) return "";

    return movie.googleDrive.embedUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          <p className="text-white text-lg animate-pulse">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  if (error || !movie || !movie.googleDrive || !movie.googleDrive.embedUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-xl max-w-md text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h1 className="text-2xl font-bold text-white mb-4">
            {error || "Không tìm thấy phim hoặc phim chưa có bản xem online"}
          </h1>
          <p className="text-gray-300 mb-6">
            Vui lòng quay lại trang phim để xem thông tin chi tiết hoặc thử lại
            sau.
          </p>
          <Link
            href={`/movies/${movieId}`}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <FiArrowLeft />
            Quay lại trang phim
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Container chính */}
      <div className="relative">
        {/* Video Player Container */}
        <div
          ref={playerContainerRef}
          className="bg-black aspect-video relative"
          onMouseMove={handleMouseMove}
        >
          {/* Khung video - Đặt lên trên cùng và cho phép tương tác trực tiếp */}
          <div className="absolute inset-0 z-30">
            <iframe
              src={getVideoUrl()}
              title={movie.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
            ></iframe>
          </div>

          {/* Overlay điều khiển - Chỉ hiển thị khi di chuột */}
          {showControls && (
            <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
              <div className="bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 pointer-events-auto">
                  <Link
                    href={`/movies/${movieId}`}
                    className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-2 rounded-full transition-all duration-300"
                  >
                    <FiArrowLeft size={20} />
                  </Link>
                  <h2 className="text-white font-medium text-lg hidden md:block">
                    {movie.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={toggleFavorite}
                    className={`${
                      isFavorite ? "bg-red-600" : "bg-black/40"
                    } backdrop-blur-sm hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300`}
                  >
                    <FiHeart size={20} />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-2 rounded-full transition-all duration-300"
                  >
                    {isFullscreen ? (
                      <FiMinimize size={20} />
                    ) : (
                      <FiMaximize size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nền trang trí - Đặt ở dưới cùng */}
          <div className="absolute inset-0 z-10">
            {movie.backdropPath && (
              <div
                className="w-full h-full opacity-20 blur-xl"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdropPath})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            )}
          </div>
        </div>

        {/* Thông tin phim */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Tiêu đề phim và thông tin cơ bản */}
          <div className="mb-8 border-b border-gray-800 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {movie.title}
                </h1>
                {movie.originalTitle !== movie.title && (
                  <h2 className="text-xl text-gray-400 italic mb-4">
                    {movie.originalTitle}
                  </h2>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg">
                  <FiStar className="mr-2" />
                  <span className="font-bold mr-1">
                    {movie.voteAverage.toFixed(1)}
                  </span>
                  <span>/10</span>
                </div>

                <div className="flex items-center bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg">
                  <FiCalendar className="mr-2" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Thông tin chính */}
            <div className="md:col-span-2 space-y-8">
              {/* Nội dung phim */}
              <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
                  Nội dung phim
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Diễn viên chính */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
                    Diễn viên chính
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {movie.cast.slice(0, 6).map((castMember, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-red-500/30">
                          <img
                            src={`https://image.tmdb.org/t/p/w200${castMember.actor.profilePath}`}
                            alt={castMember.actor.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/200x200?text=No+Image";
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {castMember.actor.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {castMember.character}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Đánh giá của người xem */}
              <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
                  Đánh giá từ người xem
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                      {movie.voteAverage.toFixed(1)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(movie.voteAverage / 2)
                                    ? "text-yellow-500"
                                    : "text-gray-500"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-white">
                            {Math.round(movie.voteAverage / 2)}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full"
                            style={{
                              width: `${(movie.voteAverage / 10) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Cốt truyện</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= 4 ? "text-yellow-500" : "text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Diễn xuất</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= 5 ? "text-yellow-500" : "text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Hình ảnh</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= 4 ? "text-yellow-500" : "text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Âm thanh</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= 4 ? "text-yellow-500" : "text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                      Đánh giá phim này
                    </button>
                  </div>
                </div>
              </div>

              {/* Đề xuất phim tương tự */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
                  Có thể bạn cũng thích
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {similarMovies.map((movie) => (
                    <Link
                      key={movie._id}
                      href={`/movies/${movie.tmdbId}/watch`}
                      className="bg-gray-800/30 rounded-lg overflow-hidden group hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <div className="aspect-[2/3] relative">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm transition-colors">
                            Xem ngay
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-white font-medium line-clamp-1">
                          {movie.title}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          {new Date(movie.releaseDate).getFullYear()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Thông tin phụ */}
            <div className="space-y-6">
              {/* Thông tin chi tiết */}
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                  Thông tin chi tiết
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">
                      Ngày phát hành
                    </h4>
                    <p className="text-white">
                      {new Date(movie.releaseDate).toLocaleDateString("vi-VN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Thể loại</h4>
                    <p className="text-white">
                      {movie.genres.map((genre) => genre.name).join(", ")}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Đánh giá</h4>
                    <p className="text-white flex items-center">
                      <FiStar className="text-yellow-500 mr-1" />
                      {movie.voteAverage.toFixed(1)}/10 ({movie.voteCount} lượt)
                    </p>
                  </div>
                </div>
              </div>

              {/* Chia sẻ phim */}
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                  Chia sẻ phim này
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chất lượng phim */}
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                  Chất lượng phim
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Độ phân giải</span>
                    <span className="bg-blue-600/30 text-blue-400 px-3 py-1 rounded text-sm font-medium">
                      Full HD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Âm thanh</span>
                    <span className="bg-green-600/30 text-green-400 px-3 py-1 rounded text-sm font-medium">
                      Stereo
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Phụ đề</span>
                    <span className="bg-purple-600/30 text-purple-400 px-3 py-1 rounded text-sm font-medium">
                      Tiếng Việt
                    </span>
                  </div>
                </div>
              </div>

              {/* Báo cáo */}
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                  Gặp vấn đề?
                </h3>
                <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center justify-center gap-2">
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
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Báo cáo lỗi phim
                </button>
              </div>
            </div>
          </div>

          {/* Bình luận */}
          <div className="md:col-span-2 space-y-8">
            {movie && (
              <CommentSection movieId={movie._id} tmdbId={movie.tmdbId} />
            )}
          </div>

          {/* Footer */}
          <div className="mt-16 border-t border-gray-800 pt-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Bản quyền thuộc về nhà phát hành
                  phim. Trang web chỉ cung cấp đường dẫn xem phim.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href={`/movies/${movieId}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Thông tin phim
                </Link>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Trang chủ
                </Link>
                <Link
                  href="/movies"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Danh sách phim
                </Link>
                <button className="text-gray-300 hover:text-white transition-colors text-sm">
                  Báo cáo vi phạm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
