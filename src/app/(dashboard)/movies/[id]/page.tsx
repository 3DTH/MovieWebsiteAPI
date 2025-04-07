"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiPlay,
  FiPlus,
  FiShare2,
  FiStar,
  FiClock,
  FiCalendar,
  FiChevronRight,
  FiHeart,
} from "react-icons/fi";
import { getMovieDetails, Movie } from "@/app/api/movieApi";
import CommentSection from "@/components/comments/CommentSection";
import { useAuth } from "@/contexts/AuthContext";
import { addToFavorites, removeFromFavorites, checkIsFavorite } from "@/app/api/favoriteApi";
import { toast } from "react-hot-toast";

// Format runtime to hours and minutes
const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

interface MovieCardProps {
  movie: {
    _id: string;
    tmdbId: number;
    title: string;
    posterPath: string;
    voteAverage?: number;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <Link href={`/movies/${movie.tmdbId}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-sm font-medium line-clamp-2">{movie.title}</h3>

            {movie.voteAverage && (
              <div className="flex items-center mt-1">
                <FiStar className="text-yellow-500 mr-1 h-3 w-3" />
                <span className="text-xs">{movie.voteAverage.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Add to watchlist"
      >
        <FiPlus className="text-white h-4 w-4" />
      </motion.button>
    </motion.div>
  );
};

export default function MovieDetail() {
  const params = useParams();
  const movieId = params.id as string;
  const { isAuthenticated } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideo, setSelectedVideo] = useState<{
    key: string;
    name: string;
    type: string;
  } | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const videosRef = React.useRef<HTMLDivElement>(null);

  // Check if movie is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && movieId) {
        try {
          const isFav = await checkIsFavorite(movieId);
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };

    checkFavoriteStatus();
  }, [movieId, isAuthenticated]);

  // Handle favorite toggle
  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm phim vào danh sách yêu thích");
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(movieId);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await addToFavorites(movieId);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Không thể cập nhật danh sách yêu thích");
    }
  };

  // Fetch movie data based on movieId
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const response = await getMovieDetails(movieId);

        if (response.data.success) {
          setMovie(response.data.data);

          // Fetch similar movies (this would be implemented in a real API)
          // For now, we'll just use empty array
          setSimilarMovies([]);
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
  }, [movieId]);

  // Function to scroll to videos section
  const scrollToVideos = () => {
    setActiveTab("media");
    setTimeout(() => {
      videosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {error || "Movie not found"}
        </h1>
        <Link href="/" className="px-4 py-2 bg-red-600 text-white rounded-md">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section with Backdrop */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
            alt={movie.title}
            fill
            priority
            className="object-cover object-center"
            style={{ objectPosition: "center 20%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16 md:pb-24">
          <div className="w-full">
            {/* Movie Info Container - Combined poster and details */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden md:block md:self-stretch"
              >
                <div className="relative h-full w-[250px] rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="250px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-20"></div>
                  <div className="absolute bottom-2 left-2 flex items-center bg-black/60 px-2 py-1 rounded-md">
                    <FiStar className="text-yellow-500 mr-1 h-3 w-3" />
                    <span className="text-xs font-bold">
                      {movie.voteAverage.toFixed(1)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Movie Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white flex-1"
              >
                {/* Title and Tagline */}
                <div className="mb-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                    {movie.title}
                  </h1>
                  {movie.originalTitle !== movie.title && (
                    <p className="text-xl text-gray-300 italic drop-shadow-md">
                      {movie.originalTitle}
                    </p>
                  )}
                </div>

                {/* Movie Stats */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm md:text-base">
                  <div className="flex items-center bg-black/40 px-3 py-1 rounded-full">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="font-medium">
                      {movie.voteAverage.toFixed(1)}
                    </span>
                    <span className="text-gray-400 ml-1 hidden sm:inline">
                      ({movie.voteCount.toLocaleString()})
                    </span>
                  </div>
                  {movie.releaseDate && (
                    <div className="flex items-center bg-black/40 px-3 py-1 rounded-full">
                      <FiCalendar className="text-gray-400 mr-1" />
                      <span>{formatDate(movie.releaseDate)}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genres/${genre.id}`}
                      className="text-sm px-3 py-1 bg-red-600/80 hover:bg-red-500/80 rounded-full transition-colors font-medium"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>

                {/* Short Description - Only visible on larger screens */}
                <div className="hidden md:block mb-6">
                  <p className="text-gray-300 line-clamp-3">{movie.overview}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {movie.videos && movie.videos.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={scrollToVideos}
                      className="flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                    >
                      <FiPlay className="mr-2" /> Xem trailer
                    </motion.button>
                  )}

                  {movie.googleDrive && movie.googleDrive.embedUrl && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        (window.location.href = `/movies/${movie.tmdbId}/watch`)
                      }
                      className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                    >
                      <FiPlay className="mr-2" /> Xem ngay
                    </motion.button>
                  )}

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors"
                      aria-label="Add to watchlist"
                    >
                      <FiPlus className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleFavoriteClick}
                      className={`flex items-center justify-center w-10 h-10 ${
                        isFavorite 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-gray-800/80 hover:bg-gray-700/80'
                      } text-white rounded-full transition-colors`}
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <FiHeart 
                        className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} 
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors"
                      aria-label="Share"
                    >
                      <FiShare2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Poster (visible only on mobile) */}
          <div className="md:hidden mb-8">
            <div className="relative aspect-[2/3] w-48 max-w-full mx-auto rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.title}
                fill
                className="object-cover object-center"
                sizes="192px"
                style={{ maxHeight: "288px" }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-800 mb-8">
            <nav className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-red-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab("cast")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "cast"
                    ? "border-red-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Diễn viên
              </button>
              {movie.videos && movie.videos.length > 0 && (
                <button
                  onClick={() => setActiveTab("media")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "media"
                      ? "border-red-500 text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Media
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mb-12">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-200">
                  Nội dung phim
                </h2>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  {movie.overview}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">
                      Chi tiết
                    </h3>
                    <ul className="space-y-3">
                      {movie.directors && movie.directors.length > 0 && (
                        <li className="flex">
                          <span className="text-gray-400 w-40">Đạo diễn</span>
                          <span className="text-gray-400 w-40">
                            {movie.directors.map((d) => d.name).join(", ")}
                          </span>
                        </li>
                      )}
                      <li className="flex">
                        <span className="text-gray-400 w-40">
                          Ngày phát hành
                        </span>
                        <span className="text-gray-400 w-40">
                          {formatDate(movie.releaseDate)}
                        </span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Đánh giá</span>
                        <span className="text-gray-400 w-40">
                          {movie.voteAverage.toFixed(1)} ({movie.voteCount} đánh
                          giá)
                        </span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Độ phổ biến</span>
                        <span className="text-gray-400 w-40">
                          {movie.popularity.toFixed(1)}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">
                      Thể loại
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/genres/${genre.id}`}
                          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors"
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cast Preview - Updated Design */}
                {movie.cast && movie.cast.length > 0 && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Diễn viên chính</h3>
                      <button
                        onClick={() => setActiveTab("cast")}
                        className="text-red-500 hover:text-red-400 flex items-center text-sm"
                      >
                        Xem tất cả <FiChevronRight className="ml-1" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {movie.cast.slice(0, 6).map((castMember, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${castMember.actor.profilePath}`}
                              alt={castMember.actor.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <h4 className="font-bold text-sm drop-shadow-md">
                              {castMember.actor.name}
                            </h4>
                            <p className="text-gray-300 text-xs mt-1 italic drop-shadow-md">
                              {castMember.character}
                            </p>
                          </div>
                          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 m-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            Xem chi tiết
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cast Tab */}
            {activeTab === "cast" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Diễn viên & Đoàn phim
                </h2>

                {movie.directors && movie.directors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Đạo diễn</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {movie.directors.map((director, index) => (
                        <div key={index} className="text-center">
                          <div className="relative aspect-square rounded-full overflow-hidden mb-2 mx-auto w-24">
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${director.profilePath}`}
                              alt={director.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h4 className="font-medium text-sm">
                            {director.name}
                          </h4>
                          <p className="text-gray-400 text-xs">Đạo diễn</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {movie.cast && movie.cast.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Diễn viên</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {movie.cast.map((castMember, index) => (
                        <Link
                          href={`/actors/${castMember.actor.tmdbId}`}
                          key={index}
                          className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <div className="relative aspect-[2/3] overflow-hidden">
                            <Image
                              src={`https://image.tmdb.org/t/p/w300${castMember.actor.profilePath}`}
                              alt={castMember.actor.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h4 className="font-bold text-sm drop-shadow-md">
                              {castMember.actor.name}
                            </h4>
                            <p className="text-gray-300 text-xs mt-1 italic drop-shadow-md">
                              {castMember.character}
                            </p>
                          </div>
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            Chi tiết
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div ref={videosRef}>
                <h2 className="text-2xl font-bold mb-6">Videos & Trailers</h2>

                {movie.videos && movie.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movie.videos.map((video, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                            alt={video.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600/90 rounded-full p-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-500">
                              <FiPlay className="h-8 w-8 text-white" />
                            </div>
                          </div>

                          {/* Video type badge */}
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {video.type}
                          </div>
                        </div>

                        {/* Video info with gradient background */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                          <h4 className="font-bold text-white text-sm line-clamp-1 drop-shadow-md">
                            {video.name}
                          </h4>
                          <div className="flex items-center mt-2">
                            <span className="text-gray-300 text-xs bg-black/50 px-2 py-1 rounded-full">
                              {video.type === "Trailer"
                                ? "🎬 Official Trailer"
                                : `🎞️ ${video.type}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Không có video nào cho phim này.
                  </p>
                )}

                {/* Video Modal */}
                {selectedVideo && (
                  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl">
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute -top-10 right-0 text-white hover:text-red-500"
                      >
                        Đóng
                      </button>
                      <div className="relative aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                          title={selectedVideo.name}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          allow="autoplay"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bình luận */}
          {movie && (
            <div className="mb-12">
              <CommentSection movieId={movie._id} tmdbId={movie.tmdbId} />
            </div>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Phim tương tự</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similarMovies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
