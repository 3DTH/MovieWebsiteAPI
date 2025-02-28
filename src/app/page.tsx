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

// Dữ liệu mẫu - sau này sẽ được thay thế bằng dữ liệu từ API
const featuredMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    posterPath: "/poster1.jpg",
    backdropPath: "/backdrop1.jpg",
    rating: 8.5,
    releaseDate: "2024-03-01",
    genres: ["Sci-Fi", "Adventure"],
  },
  {
    id: 2,
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    posterPath: "/poster2.jpg",
    backdropPath: "/backdrop2.jpg",
    rating: 8.7,
    releaseDate: "2023-07-21",
    genres: ["Biography", "Drama", "History"],
  },
  {
    id: 3,
    title: "Poor Things",
    description:
      "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
    posterPath: "/poster3.jpg",
    backdropPath: "/backdrop3.jpg",
    rating: 8.2,
    releaseDate: "2023-12-08",
    genres: ["Romance", "Sci-Fi", "Comedy"],
  },
];

const trendingMovies = [
  {
    id: 4,
    title: "The Beekeeper",
    posterPath: "/poster4.jpg",
    rating: 7.4,
  },
  {
    id: 5,
    title: "Madame Web",
    posterPath: "/poster5.jpg",
    rating: 5.6,
  },
  {
    id: 6,
    title: "Argylle",
    posterPath: "/poster6.jpg",
    rating: 6.2,
  },
  {
    id: 7,
    title: "Anyone But You",
    posterPath: "/poster7.jpg",
    rating: 7.0,
  },
  {
    id: 8,
    title: "Bob Marley: One Love",
    posterPath: "/poster8.jpg",
    rating: 7.8,
  },
  {
    id: 9,
    title: "Migration",
    posterPath: "/poster9.jpg",
    rating: 7.5,
  },
];

const popularMovies = [
  {
    id: 10,
    title: "Barbie",
    posterPath: "/poster10.jpg",
    rating: 7.3,
  },
  {
    id: 11,
    title: "The Super Mario Bros. Movie",
    posterPath: "/poster11.jpg",
    rating: 7.1,
  },
  {
    id: 12,
    title: "Guardians of the Galaxy Vol. 3",
    posterPath: "/poster12.jpg",
    rating: 8.0,
  },
  {
    id: 13,
    title: "Fast X",
    posterPath: "/poster13.jpg",
    rating: 6.5,
  },
  {
    id: 14,
    title: "John Wick: Chapter 4",
    posterPath: "/poster14.jpg",
    rating: 8.2,
  },
  {
    id: 15,
    title: "Spider-Man: Across the Spider-Verse",
    posterPath: "/poster15.jpg",
    rating: 8.7,
  },
];

const upcomingMovies = [
  {
    id: 16,
    title: "Kingdom of the Planet of the Apes",
    posterPath: "/poster16.jpg",
    releaseDate: "2024-05-10",
  },
  {
    id: 17,
    title: "Furiosa: A Mad Max Saga",
    posterPath: "/poster17.jpg",
    releaseDate: "2024-05-24",
  },
  {
    id: 18,
    title: "Inside Out 2",
    posterPath: "/poster18.jpg",
    releaseDate: "2024-06-14",
  },
  {
    id: 19,
    title: "A Quiet Place: Day One",
    posterPath: "/poster19.jpg",
    releaseDate: "2024-06-28",
  },
];

const genres = [
  { id: 28, name: "Hành động", image: "/genre-action.jpg" },
  { id: 12, name: "Phiêu lưu", image: "/genre-adventure.jpg" },
  { id: 16, name: "Hoạt hình", image: "/genre-animation.jpg" },
  { id: 35, name: "Hài", image: "/genre-comedy.jpg" },
  { id: 80, name: "Tội phạm", image: "/genre-crime.jpg" },
  { id: 18, name: "Chính kịch", image: "/genre-drama.jpg" },
  { id: 14, name: "Giả tưởng", image: "/genre-fantasy.jpg" },
  { id: 27, name: "Kinh dị", image: "/genre-horror.jpg" },
];

// Movie Card Component
interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    posterPath: string;
    rating?: number;
    releaseDate?: string;
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

  // Auto-slide effect for hero banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Backdrop Image */}
            <div className="absolute inset-0">
              <Image
                src={movie.backdropPath}
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
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{movie.releaseDate}</span>
                  <span>•</span>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="text-sm px-2 py-1 bg-gray-800/60 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md font-medium"
                  >
                    <FiPlay className="mr-2" /> Xem ngay
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-6 py-3 bg-gray-800/80 text-white rounded-md font-medium"
                  >
                    <FiInfo className="mr-2" /> Chi tiết
                  </motion.button>
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

      {/* Trending Movies */}
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Phim đang thịnh hành
            </h2>
            <Link
              href="/movies/trending"
              className="text-red-500 hover:text-red-400 flex items-center"
            >
              Xem tất cả <FiChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="py-12 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Khám phá theo thể loại
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <Link key={genre.id} href={`/genres/${genre.id}`}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative h-32 rounded-lg overflow-hidden"
                >
                  <Image
                    src={genre.image}
                    alt={genre.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">
                      {genre.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Movies */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Phim phổ biến</h2>
            <Link
              href="/movies/popular"
              className="text-red-500 hover:text-red-400 flex items-center"
            >
              Xem tất cả <FiChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Movies */}
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Phim sắp chiếu</h2>
            <Link
              href="/movies/upcoming"
              className="text-red-500 hover:text-red-400 flex items-center"
            >
              Xem tất cả <FiChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
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
