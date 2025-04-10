"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";
import {
  getMovies,
  searchMovies,
  deleteMovie,
  syncAllMovies,
  syncNowPlayingMovies,
  syncPopularMovies,
} from "@/app/api/movieApi";
import type { Movie } from "@/app/api/movieApi";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [totalMovies, setTotalMovies] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const moviesPerPage = 10;

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      let response;
      if (searchTerm) {
        response = await searchMovies({
          keyword: searchTerm,
          page: currentPage,
          limit: moviesPerPage,
        });
      } else {
        response = await getMovies(currentPage, moviesPerPage);
      }

      if (response.data.success) {
        setMovies(response.data.data);
        setFilteredMovies(response.data.data);
        setTotalPages(Math.ceil((response.data.total || 0) / moviesPerPage));
        setTotalMovies(response.data.total || 0); // Add this line
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm hàm xử lý xóa
  const handleDelete = async (movie: Movie) => {
    setMovieToDelete(movie);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;

    setIsDeleting(true);
    try {
      await deleteMovie(movieToDelete._id);
      await fetchMovies(); // Refresh danh sách
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting movie:", error);
    } finally {
      setIsDeleting(false);
      setMovieToDelete(null);
    }
  };

  const handleSync = async (syncFunction: Function, type: string) => {
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncMessage(`Đang đồng bộ ${type}...`);
    setSyncProgress(0);

    try {
      // Sync 3 pages with progress tracking
      for (let page = 1; page <= 3; page++) {
        await syncFunction(page, 1);
        setSyncProgress(Math.floor((page / 3) * 100));
      }

      await fetchMovies();
      setSyncMessage(`Đồng bộ ${type} thành công!`);
      setSyncProgress(100);
    } catch (error) {
      console.error(`Error syncing ${type}:`, error);
      setSyncMessage(`Lỗi khi đồng bộ ${type}`);
    } finally {
      setTimeout(() => {
        setSyncMessage("");
        setSyncProgress(0);
      }, 3000);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 500); // Delay 500ms after typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800"
        >
          Movie Management
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 items-center"
        >
          {(syncMessage || syncProgress > 0) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{syncMessage}</span>
              {syncProgress > 0 && (
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => handleSync(syncPopularMovies, "phim phổ biến")}
            disabled={isSyncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FiRefreshCw
              className={`mr-2 ${isSyncing ? "animate-spin" : ""}`}
            />
            Đồng bộ Phim Phổ Biến
          </button>
          <button
            onClick={() => handleSync(syncNowPlayingMovies, "phim đang chiếu")}
            disabled={isSyncing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FiRefreshCw
              className={`mr-2 ${isSyncing ? "animate-spin" : ""}`}
            />
            Đồng bộ Phim Đang Chiếu
          </button>
          <button
            onClick={() => handleSync(syncAllMovies, "tất cả phim")}
            disabled={isSyncing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FiRefreshCw
              className={`mr-2 ${isSyncing ? "animate-spin" : ""}`}
            />
            Đồng bộ Tất cả Phim
          </button>
          <Link
            href="/admin/movies/add"
            className="px-4 py-2 flex items-center text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            <FiPlus className="mr-2" />
            Thêm phim mới
          </Link>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search movies..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Movies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-xl mb-2">No movies found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Release Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Genres
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovies.map((movie) => (
                    <tr
                      key={movie._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={
                                movie.posterPath
                                  ? movie.posterPath.startsWith('http')  // Check if it's a full URL (Cloudinary)
                                    ? movie.posterPath
                                    : `https://image.tmdb.org/t/p/w92${movie.posterPath}`
                                  : "/images/movie-placeholder.jpg"
                              }
                              alt={movie.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {movie.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {movie.directors.length > 0
                                ? movie.directors[0].name
                                : "Unknown director"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre.id}
                              className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-yellow-500 mr-1">
                            ★
                          </span>
                          <span className="text-sm text-gray-300">
                            {movie.voteAverage.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/movies/${movie.tmdbId}`}
                            target="_blank"
                          >
                            <button className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                              <FiEye className="w-5 h-5" />
                            </button>
                          </Link>
                          <Link href={`/admin/movies/edit/${movie._id}`}>
                            <button className="text-green-400 hover:text-green-300 transition-colors cursor-pointer">
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(movie)}
                            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            disabled={isDeleting}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>

                      {/* Thêm Modal xác nhận xóa */}
                      {isDeleteModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                              Xác nhận xóa phim
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Bạn có chắc chắn muốn xóa phim "
                              {movieToDelete?.title}"? Hành động này không thể
                              hoàn tác.
                            </p>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                disabled={isDeleting}
                              >
                                Hủy
                              </button>
                              <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Đang xóa..." : "Xóa"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span> • Total
                    movies: <span className="font-medium">{totalMovies}</span>
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">First</span>
                      ««
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>«
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>»
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Last</span>
                      »»
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
