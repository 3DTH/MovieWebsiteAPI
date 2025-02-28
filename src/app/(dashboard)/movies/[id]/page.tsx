"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiPlay,
  FiPlus,
  FiShare2,
  FiDownload,
  FiStar,
  FiClock,
  FiCalendar,
  FiGlobe,
  FiDollarSign,
  FiUsers,
  FiChevronRight,
  FiHeart,
} from "react-icons/fi";

// Dữ liệu mẫu - sau này sẽ được thay thế bằng dữ liệu từ API
const movieData = {
  id: 1,
  title: "Dune: Part Two",
  tagline: "Long live the fighters",
  description:
    "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. As he makes a choice between the love of his life and the fate of the universe, he must prevent a terrible future that only he can foresee.",
  posterPath: "/imageTest.jpg",
  backdropPath: "/imageTest.jpg",
  rating: 8.5,
  voteCount: 2345,
  releaseDate: "2024-03-01",
  runtime: 166, // minutes
  budget: 190000000,
  revenue: 670000000,
  status: "Released",
  originalLanguage: "English",
  genres: ["Sci-Fi", "Adventure", "Drama"],
  productionCompanies: ["Legendary Pictures", "Warner Bros."],
  director: "Denis Villeneuve",
  writers: ["Jon Spaihts", "Denis Villeneuve", "Frank Herbert"],
  cast: [
    {
      id: 1,
      name: "Timothée Chalamet",
      character: "Paul Atreides",
      profilePath: "/imageTest.jpg",
    },
    {
      id: 2,
      name: "Zendaya",
      character: "Chani",
      profilePath: "/imageTest.jpg",
    },
    {
      id: 3,
      name: "Rebecca Ferguson",
      character: "Lady Jessica",
      profilePath: "/imageTest.jpg",
    },
    {
      id: 4,
      name: "Josh Brolin",
      character: "Gurney Halleck",
      profilePath: "/imageTest.jpg",
    },
    {
      id: 5,
      name: "Javier Bardem",
      character: "Stilgar",
      profilePath: "/imageTest.jpg",
    },
    {
      id: 6,
      name: "Austin Butler",
      character: "Feyd-Rautha Harkonnen",
      profilePath: "/imageTest.jpg",
    },
  ],
  videos: [
    {
      id: 1,
      name: "Official Trailer",
      key: "trailer1",
      type: "Trailer",
      site: "YouTube",
    },
    { id: 2, name: "Teaser", key: "teaser1", type: "Teaser", site: "YouTube" },
    {
      id: 3,
      name: "Behind the Scenes",
      key: "bts1",
      type: "Featurette",
      site: "YouTube",
    },
  ],
  images: [
    { path: "/imageTest.jpg", type: "backdrop" },
    { path: "/imageTest.jpg", type: "backdrop" },
    { path: "/imageTest.jpg", type: "backdrop" },
    { path: "/imageTest.jpg", type: "backdrop" },
  ],
  similar: [
    { id: 2, title: "Dune", posterPath: "/imageTest.jpg", rating: 8.0 },
    {
      id: 3,
      title: "Blade Runner 2049",
      posterPath: "/imageTest.jpg",
      rating: 8.1,
    },
    { id: 4, title: "Arrival", posterPath: "/imageTest.jpg", rating: 7.9 },
    { id: 5, title: "Interstellar", posterPath: "/imageTest.jpg", rating: 8.6 },
    { id: 6, title: "Foundation", posterPath: "/imageTest.jpg", rating: 7.5 },
    { id: 7, title: "The Expanse", posterPath: "/imageTest.jpg", rating: 8.5 },
  ],
};

// Format runtime to hours and minutes
const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    posterPath: string;
    rating?: number;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <Link href={`/movies/${movie.id}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
          <Image
            src={movie.posterPath}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-sm font-medium line-clamp-2">{movie.title}</h3>

            {movie.rating && (
              <div className="flex items-center mt-1">
                <FiStar className="text-yellow-500 mr-1 h-3 w-3" />
                <span className="text-xs">{movie.rating.toFixed(1)}</span>
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
export default function MovieDetail({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    key: string;
    name: string;
    type: string;
  } | null>(null);
  const videosRef = React.useRef<HTMLDivElement>(null);

  // Fetch movie data based on params.id
  // For now, we'll use the sample data
  const movie = movieData;

  // Function to scroll to videos section
  const scrollToVideos = () => {
    setActiveTab("media");
    setTimeout(() => {
      videosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section with Backdrop */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image
            src={movie.backdropPath}
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
                    src={movie.posterPath}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="250px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-20"></div>
                  <div className="absolute bottom-2 left-2 flex items-center bg-black/60 px-2 py-1 rounded-md">
                    <FiStar className="text-yellow-500 mr-1 h-3 w-3" />
                    <span className="text-xs font-bold">{movie.rating.toFixed(1)}</span>
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
                  {movie.tagline && (
                    <p className="text-xl text-gray-300 italic drop-shadow-md">
                      {movie.tagline}
                    </p>
                  )}
                </div>

                {/* Movie Stats */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm md:text-base">
                  <div className="flex items-center bg-black/40 px-3 py-1 rounded-full">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="font-medium">{movie.rating.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1 hidden sm:inline">
                      ({movie.voteCount.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center bg-black/40 px-3 py-1 rounded-full">
                    <FiClock className="text-gray-400 mr-1" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                  <div className="flex items-center bg-black/40 px-3 py-1 rounded-full">
                    <FiCalendar className="text-gray-400 mr-1" />
                    <span>{formatDate(movie.releaseDate)}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre}
                      href={`/genres/${genre.toLowerCase()}`}
                      className="text-sm px-3 py-1 bg-red-600/80 hover:bg-red-500/80 rounded-full transition-colors font-medium"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>

                {/* Short Description - Only visible on larger screens */}
                <div className="hidden md:block mb-6">
                  <p className="text-gray-300 line-clamp-3">
                    {movie.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToVideos}
                    className="flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                  >
                    <FiPlay className="mr-2" /> Xem trailer
                  </motion.button>
                  <Link href={`/watch/${movie.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                    >
                      <FiPlay className="mr-2" /> Xem phim
                    </motion.button>
                  </Link>
                  
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
                      className="flex items-center justify-center w-10 h-10 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors"
                      aria-label="Add to favorites"
                    >
                      <FiHeart className="h-5 w-5" />
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
                src={movie.posterPath}
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
                Tổng quanh
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
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-red-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Đánh giá
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mb-12">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Nội dung phim</h2>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  {movie.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Chi tiết</h3>
                    <ul className="space-y-3">
                      <li className="flex">
                        <span className="text-gray-400 w-40">Đạo diễn</span>
                        <span>{movie.director}</span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Biên kịch</span>
                        <span>{movie.writers.join(", ")}</span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Nhà sản xuất</span>
                        <span>{movie.productionCompanies.join(", ")}</span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Ngôn ngữ gốc</span>
                        <span>{movie.originalLanguage}</span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Trạng thái</span>
                        <span>{movie.status}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Thông tin</h3>
                    <ul className="space-y-3">
                      <li className="flex">
                        <span className="text-gray-400 w-40">
                          Ngày phát hành
                        </span>
                        <span>{formatDate(movie.releaseDate)}</span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Thời lượng</span>
                        <span>{formatRuntime(movie.runtime)}</span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Ngân sách</span>
                        <span>{formatCurrency(movie.budget)}</span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-400 w-40">Doanh thu</span>
                        <span>{formatCurrency(movie.revenue)}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Cast Preview */}
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
                    {movie.cast.slice(0, 6).map((person) => (
                      <div key={person.id} className="text-center">
                        <div className="relative aspect-square rounded-full overflow-hidden mb-2 mx-auto w-24">
                          <Image
                            src={person.profilePath}
                            alt={person.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-sm">{person.name}</h4>
                        <p className="text-gray-400 text-xs">
                          {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Cast Tab */}
            {activeTab === "cast" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Diễn viên & Đoàn phim
                </h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Diễn viên</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movie.cast.map((person) => (
                      <div
                        key={person.id}
                        className="bg-gray-900 rounded-lg overflow-hidden"
                      >
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <Image
                            src={person.profilePath}
                            alt={person.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium">{person.name}</h4>
                          <p className="text-gray-400 text-sm">
                            {person.character}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Đoàn phim</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h4 className="font-medium">Đạo diễn</h4>
                      <p className="text-gray-300">{movie.director}</p>
                    </div>

                    {movie.writers.map((writer, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg p-4">
                        <h4 className="font-medium">Biên kịch</h4>
                        <p className="text-gray-300">{writer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Videos & Hình ảnh</h2>

                <div className="mb-8" ref={videosRef}>
                  <h3 className="text-xl font-semibold mb-4">Videos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movie.videos.map((video) => (
                      <motion.div
                        key={video.id}
                        className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="relative aspect-video cursor-pointer group">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/90 group-hover:to-black/30 transition-all duration-300"></div>
                          
                          {/* Video info overlay */}
                          <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                            <div className="flex items-center space-x-2">
                              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">{video.site}</span>
                              <span className="bg-gray-800/80 text-gray-200 text-xs px-2 py-1 rounded">{video.type}</span>
                            </div>
                            <h4 className="font-medium text-lg drop-shadow-md group-hover:text-white transition-colors">{video.name}</h4>
                          </div>
                          
                          {/* Play button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                              className="h-16 w-16 rounded-full bg-red-600/80 flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiPlay className="h-8 w-8 text-white ml-1" />
                            </motion.div>
                          </div>
                          
                          <Image
                            src="/imageTest.jpg"
                            alt={video.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Hình ảnh</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {movie.images.map((image, index) => (
                      <motion.div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={image.path}
                          alt={`${movie.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Đánh giá từ người xem</h2>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Viết đánh giá
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Sample reviews */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-start mb-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src="/imageTest.jpg"
                          alt="User avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Nguyễn Văn A</h4>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={
                                  i < 4 ? "text-yellow-500" : "text-gray-500"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm ml-2">
                            2 ngày trước
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Phim hay tuyệt vời, đặc biệt là phần hình ảnh và âm thanh.
                      Denis Villeneuve đã làm rất tốt trong việc chuyển thể tác
                      phẩm kinh điển này lên màn ảnh.
                    </p>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-start mb-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src="/imageTest.jpg"
                          alt="User avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Trần Thị B</h4>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={
                                  i < 5 ? "text-yellow-500" : "text-gray-500"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm ml-2">
                            1 tuần trước
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Tuyệt vời! Diễn xuất của dàn cast rất ấn tượng, đặc biệt
                      là Timothée Chalamet và Zendaya. Cốt truyện phức tạp nhưng
                      được kể một cách mạch lạc.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Similar Movies */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Phim tương tự</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.similar.map((similarMovie) => (
                <MovieCard key={similarMovie.id} movie={similarMovie} />
              ))}
            </div>
          </div>
        </div>
      </section>
{/* Trailer Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/dQw4w9WgXcQ`}
              title={selectedVideo.name}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 z-10"
              aria-label="Close trailer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
