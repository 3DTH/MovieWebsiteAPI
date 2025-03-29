"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiGrid,
  FiList,
  FiColumns,
  FiLoader,
  FiX,
} from "react-icons/fi";
import Filter from "@/components/ui/Filter";
import MovieCard from "@/components/ui/MovieCard";
import MovieListItem from "@/components/ui/MovieListItem";
import MovieGridCard from "@/components/ui/MovieGridCard";
import { getMovies, Movie, searchMovies } from "@/app/api/movieApi";

// Sample data - replace with your actual API calls
const genres = [
  { id: "action", name: "Hành động" },
  { id: "comedy", name: "Hài hước" },
  { id: "drama", name: "Chính kịch" },
  { id: "horror", name: "Kinh dị" },
  { id: "romance", name: "Lãng mạn" },
  { id: "scifi", name: "Khoa học viễn tưởng" },
  { id: "fantasy", name: "Thần thoại" },
  { id: "thriller", name: "Giật gân" },
];

const years = [
  { id: "2023", name: "2023" },
  { id: "2022", name: "2022" },
  { id: "2021", name: "2021" },
  { id: "2020", name: "2020" },
  { id: "2019", name: "2019" },
  { id: "2018", name: "2018" },
  { id: "2010-2017", name: "2010-2017" },
  { id: "2000-2009", name: "2000-2009" },
  { id: "before-2000", name: "Trước 2000" },
];

const countries = [
  { id: "us", name: "Mỹ" },
  { id: "kr", name: "Hàn Quốc" },
  { id: "cn", name: "Trung Quốc" },
  { id: "jp", name: "Nhật Bản" },
  { id: "vn", name: "Việt Nam" },
  { id: "th", name: "Thái Lan" },
  { id: "uk", name: "Anh" },
  { id: "fr", name: "Pháp" },
];

const sortOptions = [
  { id: "newest", name: "Mới nhất" },
  { id: "popular", name: "Phổ biến nhất" },
  { id: "rating", name: "Đánh giá cao" },
  { id: "name-asc", name: "Tên A-Z" },
  { id: "name-desc", name: "Tên Z-A" },
];

const types = [
  { id: "all", name: "Tất cả" },
  { id: "movie", name: "Phim lẻ" },
  { id: "series", name: "Phim bộ" },
  { id: "new", name: "Phim mới" },
];

// Thêm các dữ liệu mẫu cho ratings và versions
const ratings = [
  { id: "p", name: "P (Mọi lứa tuổi)" },
  { id: "k", name: "K (Dưới 13 tuổi)" },
  { id: "t13", name: "T13 (13 tuổi trở lên)" },
  { id: "t16", name: "T16 (16 tuổi trở lên)" },
  { id: "t18", name: "T18 (18 tuổi trở lên)" },
];

const versions = [
  { id: "sub", name: "Phụ đề" },
  { id: "dub", name: "Lồng tiếng" },
  { id: "thuyetminh_bac", name: "Thuyết minh giọng Bắc" },
  { id: "thuyetminh_nam", name: "Thuyết minh giọng Nam" },
];

type ViewMode = "grid" | "list" | "masonry";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const MoviesPage = () => {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [activeFilters, setActiveFilters] = useState({
    genres: [] as string[],
    years: [] as string[],
    countries: [] as string[],
    sort: "newest",
    type: typeFromUrl || "all",
    rating: "all",
    version: "all",
  });

  // Effect to handle URL params for type filter
  useEffect(() => {
    if (typeFromUrl) {
      setActiveFilters((prev) => ({
        ...prev,
        type: typeFromUrl,
      }));
    }
  }, [typeFromUrl]);

  // Fetch movies from API
  useEffect(() => {
    fetchMovies();
  }, [currentPage, moviesPerPage]);

  // Effect to apply filters
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = [...movies];

      // Filter by type
      if (activeFilters.type !== "all") {
        if (activeFilters.type === "new") {
          // For now, we'll consider movies from the last year as "new"
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          results = results.filter((movie) => {
            const releaseDate = new Date(movie.releaseDate);
            return releaseDate >= oneYearAgo;
          });
        } else {
          // This would need to be adjusted based on your actual data structure
          // For now, we'll assume all are movies (not series)
          results = results;
        }
      }

      // Filter by genres - would need to be adjusted based on your data structure
      if (activeFilters.genres.length > 0) {
        results = results.filter((movie) =>
          movie.genres.some((genre) =>
            activeFilters.genres.includes(genre.id.toString())
          )
        );
      }

      // Filter by years
      if (activeFilters.years.length > 0) {
        results = results.filter((movie) => {
          const releaseYear = new Date(movie.releaseDate).getFullYear();
          return activeFilters.years.some((yearFilter) => {
            if (yearFilter.includes("-")) {
              const [start, end] = yearFilter.split("-").map(Number);
              return releaseYear >= start && releaseYear <= end;
            }
            if (yearFilter === "before-2000") {
              return releaseYear < 2000;
            }
            return releaseYear.toString() === yearFilter;
          });
        });
      }

      // Sort results
      switch (activeFilters.sort) {
        case "newest":
          results.sort(
            (a, b) =>
              new Date(b.releaseDate).getTime() -
              new Date(a.releaseDate).getTime()
          );
          break;
        case "popular":
          results.sort((a, b) => b.popularity - a.popularity);
          break;
        case "rating":
          results.sort((a, b) => b.voteAverage - a.voteAverage);
          break;
        case "name-asc":
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "name-desc":
          results.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }

      setFilteredMovies(results);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [activeFilters, movies]);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await getMovies(currentPage, moviesPerPage);
      if (response.data.success) {
        setMovies(response.data.data);
        setFilteredMovies(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalResults(response.data.total || response.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add debounced search function
  const debouncedSearch = React.useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        setIsLoading(true);
        setIsSearching(true);
        try {
          const response = await searchMovies({
            keyword: query,
            page: currentPage,
            limit: moviesPerPage,
          });
          if (response.data.success) {
            setMovies(response.data.data);
            setFilteredMovies(response.data.data);
            setTotalPages(response.data.totalPages || 1);
            setTotalResults(response.data.total || response.data.data.length);
          }
        } catch (error) {
          console.error("Error searching movies:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsSearching(false);
        fetchMovies(); // Reset to normal movie list
      }
    }, 500),
    [currentPage, moviesPerPage]
  );

  // Hàm searchMovies để tìm kiếm phim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSearching(true);

    try {
      const response = await searchMovies({
        keyword: searchQuery,
        page: currentPage,
        limit: moviesPerPage,
      });

      if (response.data.success) {
        setMovies(response.data.data);
        setFilteredMovies(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalResults(response.data.total || response.data.data.length);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật hàm handleFilterChange để phù hợp với cấu trúc mới
  const handleFilterChange = (filters: {
    genres: string;
    years: string;
    countries: string;
    sort: string;
    type: string;
    rating: string;
    version: string;
  }) => {
    setActiveFilters({
      genres: filters.genres === "all" ? [] : [filters.genres],
      years: filters.years === "all" ? [] : [filters.years],
      countries: filters.countries === "all" ? [] : [filters.countries],
      sort: filters.sort,
      type: filters.type,
      rating: filters.rating,
      version: filters.version,
    });
  };

  // Add function to handle page changes
  const handlePageChange = (pageNumber: number) => {
    // Only change page if it's different
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  // Calculate pagination values
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  const renderMovies = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <FiLoader className="animate-spin text-4xl text-red-500" />
        </div>
      );
    }

    if (filteredMovies.length === 0) {
      return (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">
            Không tìm thấy phim nào
          </h3>
          <p className="text-gray-400">Vui lòng thử lại với bộ lọc khác</p>
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="flex flex-col space-y-4">
              {filteredMovies.map((movie) => (
                <MovieListItem key={movie._id} movie={movie} />
              ))}
            </div>
          )}

          {viewMode === "masonry" && (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-6">
              {filteredMovies.map((movie) => (
                <div key={movie._id} className="mb-6 break-inside-avoid">
                  <MovieGridCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // Add pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-12 flex justify-center">
        <div className="flex items-center space-x-2">
          {/* Previous page button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-full 
              ${
                currentPage === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-red-600 transition-colors"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            let pageNumber;

            // Calculate which page numbers to show
            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }

            // Show ellipsis for large page ranges
            if (totalPages > 5) {
              if (index === 0 && currentPage > 3) {
                return (
                  <React.Fragment key={index}>
                    <button
                      onClick={() => handlePageChange(1)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full 
                        bg-gray-800 text-white hover:bg-red-600 transition-colors`}
                    >
                      1
                    </button>
                    <span className="text-gray-500">...</span>
                  </React.Fragment>
                );
              }

              if (index === 4 && currentPage < totalPages - 2) {
                return (
                  <React.Fragment key={index}>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full 
                        bg-gray-800 text-white hover:bg-red-600 transition-colors`}
                    >
                      {totalPages}
                    </button>
                  </React.Fragment>
                );
              }
            }

            return (
              <button
                key={index}
                onClick={() => handlePageChange(pageNumber)}
                className={`flex items-center justify-center w-10 h-10 rounded-full 
                  ${
                    currentPage === pageNumber
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-white hover:bg-red-600 transition-colors"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next page button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-full 
              ${
                currentPage === totalPages
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-red-600 transition-colors"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Update the return statement to include pagination
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
          {activeFilters.type === "all"
            ? "Tất cả phim"
            : activeFilters.type === "movie"
            ? "Phim lẻ"
            : activeFilters.type === "series"
            ? "Phim bộ"
            : "Phim mới"}
        </h1>

        {/* Add search bar */}
        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="relative flex-1 md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const newQuery = e.target.value;
                setSearchQuery(newQuery);
                debouncedSearch(newQuery);
              }}
              placeholder="Tìm kiếm phim..."
              className="w-full bg-gray-800/50 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
            {/* Existing view mode buttons */}
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Grid view"
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              title="List view"
            >
              <FiList size={20} />
            </button>
            <button
              onClick={() => setViewMode("masonry")}
              className={`p-2 rounded-md ${
                viewMode === "masonry"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Masonry view"
            >
              <FiColumns size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Show "Clear Search" button when searching */}
      {isSearching && searchQuery && (
        <div className="mb-4">
          <button
            onClick={() => {
              setSearchQuery("");
              setIsSearching(false);
              fetchMovies(); // Reset to normal movie list
            }}
            className="text-sm text-red-500 hover:text-red-400 flex items-center gap-2"
          >
            <FiX className="w-4 h-4" />
            Xóa tìm kiếm
          </button>
        </div>
      )}

      <Filter
        types={types}
        genres={genres}
        years={years}
        countries={countries}
        ratings={ratings}
        versions={versions}
        sortOptions={sortOptions}
        onFilterChange={handleFilterChange}
      />

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-400">Kết quả:</span>
          <span className="font-semibold text-white">
            {filteredMovies.length} phim
          </span>

          {activeFilters.genres.length > 0 && (
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
              <span className="text-gray-300 mr-1">Thể loại:</span>
              <span className="text-red-500">
                {activeFilters.genres
                  .map((g) => genres.find((genre) => genre.id === g)?.name)
                  .join(", ")}
              </span>
            </div>
          )}

          {activeFilters.years.length > 0 && (
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
              <span className="text-gray-300 mr-1">Năm:</span>
              <span className="text-red-500">
                {activeFilters.years
                  .map((y) => years.find((year) => year.id === y)?.name)
                  .join(", ")}
              </span>
            </div>
          )}

          {activeFilters.countries.length > 0 && (
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
              <span className="text-gray-300 mr-1">Quốc gia:</span>
              <span className="text-red-500">
                {activeFilters.countries
                  .map(
                    (c) => countries.find((country) => country.id === c)?.name
                  )
                  .join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {renderMovies()}

      {/* Add pagination */}
      {renderPagination()}

      {/* Add page info */}
      {filteredMovies.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          Hiển thị {indexOfFirstMovie + 1}-
          {Math.min(indexOfLastMovie, filteredMovies.length)} trong số{" "}
          {totalResults} phim
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
