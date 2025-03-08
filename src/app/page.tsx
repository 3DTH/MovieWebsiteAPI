"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiPlay,
  FiInfo,
  FiPlus,
  FiStar,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { getMovies, Movie } from "./api/movieApi";

// Movie Card Component
interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <Link href={`/movies/${movie._id}`}>
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

            {movie.releaseDate && (
              <div className="text-xs text-gray-300 mt-1">
                {movie.releaseDate}
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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [uniqueGenres, setUniqueGenres] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getMovies(1, 50); // Lấy nhiều phim để có dữ liệu lọc
        
        if (response.data.success && response.data.data.length > 0) {
          const allMovies = response.data.data;
          
          // Lọc phim phổ biến
          const popular = allMovies.filter(movie => movie.isPopular === true);
          setPopularMovies(popular.slice(0, 6));
          
          // Lấy 3 phim đầu tiên làm featured movies
          setFeaturedMovies(allMovies.slice(0, 3));
          
          // Lọc phim mới nhất theo ngày phát hành
          const sortedByDate = [...allMovies].sort((a, b) => 
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
          );
          setNewMovies(sortedByDate.slice(0, 6));
          
          // Trích xuất tất cả thể loại duy nhất từ các phim
          const allGenres = allMovies.flatMap(movie => movie.genres);
          const uniqueGenresMap = new Map();
          
          allGenres.forEach(genre => {
            if (!uniqueGenresMap.has(genre.id)) {
              uniqueGenresMap.set(genre.id, genre);
            }
          });
          
          // Chuyển Map thành mảng và lấy tối đa 8 thể loại
          const genreArray = Array.from(uniqueGenresMap.values());
          setUniqueGenres(genreArray.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auto-slide effect for hero banner
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {featuredMovies.length > 0 && (
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          {featuredMovies.map((movie, index) => (
            <div
              key={movie._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Backdrop Image */}
              <div className="absolute inset-0">
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
                  alt={movie.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-2xl"
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    {movie.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span>{movie.voteAverage.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{movie.releaseDate}</span>
                    <span>•</span>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="text-sm px-2 py-1 bg-gray-800/60 rounded"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                    {movie.overview}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href={`/movies/${movie._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md font-medium"
                      >
                        <FiPlay className="mr-2" /> Xem ngay
                      </motion.button>
                    </Link>
                    <Link href={`/movies/${movie._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-6 py-3 bg-gray-800/80 text-white rounded-md font-medium"
                      >
                        <FiInfo className="mr-2" /> Chi tiết
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-red-600" : "bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Next slide"
          >
            <FiChevronRight size={24} />
          </button>
        </section>
      )}

      {/* Phim phổ biến */}
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Phim phổ biến
            </h2>
            <Link
              href="/movies?filter=popular"
              className="text-red-500 hover:text-red-400 flex items-center"
            >
              Xem tất cả <FiChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Thể loại */}
      <section className="py-12 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
            Khám phá theo thể loại
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uniqueGenres.map((genre) => (
              <Link key={genre.id} href={`/genres/${genre.id}`}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative h-32 rounded-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700" />
                  <div className="absolute inset-0 flex items-center p-4">
                    <h3 className="text-lg md:text-xl font-semibold text-red-400">
                      {genre.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Phim mới cập nhật */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Phim mới cập nhật
            </h2>
            <Link
              href="/movies?sort=release_date"
              className="text-red-500 hover:text-red-400 flex items-center"
            >
              Xem tất cả <FiChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {newMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Đăng ký nhận thông báo phim mới
              </h2>
              <p className="text-gray-300 mb-6">
                Nhận thông báo về các bộ phim mới nhất và các ưu đãi đặc biệt từ
                chúng tôi
              </p>
              <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Đăng ký
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Tải ứng dụng 3DFlix
              </h2>
              <p className="text-gray-300 mb-6">
                Tải ứng dụng 3DFlix để xem phim mọi lúc mọi nơi. Có sẵn trên
                iOS và Android.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="inline-block"
                >
                  <Image
                    src="/Logo/app-store-badge.png"
                    alt="Download on the App Store"
                    width={140}
                    height={42}
                    className="h-12 w-auto"
                  />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="inline-block"
                >
                  <Image
                    src="/Logo/google-play-badge.png"
                    alt="Get it on Google Play"
                    width={140}
                    height={42}
                    className="h-12 w-auto"
                  />
                </motion.a>
              </div>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src="/app-mockup.png"
                alt="3DFlix App"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
