"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiFilter, FiStar, FiChevronDown, FiX, FiLoader, FiUsers, FiCalendar, FiRotateCcw, FiCheck } from 'react-icons/fi';
import { searchActors, Actor } from '@/app/api/actorApi';

// Filter options
const filters = {
  sortBy: ['Popularity', 'Name A-Z', 'Name Z-A'],
  gender: ['All', 'Male', 'Female'],
  ageRange: ['All', 'Under 30', '30-50', 'Over 50'],
};

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState({
    sortBy: 'Popularity',
    gender: 'All',
    ageRange: 'All',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [limit] = useState(12);

  // Fetch actors on initial load and when page changes
  useEffect(() => {
    const fetchActors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await searchActors(currentPage, limit, searchQuery || undefined);
        if (response.success) {
          setActors(response.data);
          setTotalPages(response.totalPages);
          setTotalResults(response.total);
        } else {
          setError('Failed to fetch actors');
        }
      } catch (err) {
        console.error('Error fetching actors:', err);
        setError('An error occurred while fetching actors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActors();
  }, [currentPage, limit, searchQuery]);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...actors];
    
    // Sort
    if (activeFilter.sortBy === 'Name A-Z') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeFilter.sortBy === 'Name Z-A') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      filtered.sort((a, b) => b.popularity - a.popularity);
    }
    
    setActors(filtered);
    setIsFilterOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setActiveFilter({
      sortBy: 'Popularity',
      gender: 'All',
      ageRange: 'All',
    });
    // Re-fetch with default sorting
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Handle actor selection
  const toggleActorDetails = (id: number) => {
    setSelectedActor(selectedActor === id ? null : id);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Page variants for animations
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
    exit: { y: -20, opacity: 0 }
  };

  // Helper function to get known for movies
  const getKnownForMovies = (actor: Actor) => {
    return actor.movies
      ?.slice(0, 3)
      .map(movieItem => movieItem.movie.title) || [];
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 inline-block">
            Khám Phá Diễn Viên
          </h1>
          <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
            Tìm hiểu về các diễn viên nổi tiếng, sự nghiệp và các bộ phim đáng chú ý của họ
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center"
          variants={itemVariants}
        >
          <form onSubmit={handleSearch} className="w-full md:w-2/3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm diễn viên..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
            <button
              type="submit"
              className="absolute right-3 top-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5"
            >
              Tìm
            </button>
          </form>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
          >
            <FiFilter className="mr-2" />
            Bộ lọc
            <FiChevronDown className={`ml-2 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </motion.button>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-8 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sort By */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <FiFilter className="mr-2 text-red-500" />
                    Sắp xếp theo
                  </h3>
                  <div className="space-y-3">
                    {filters.sortBy.map((option) => (
                      <motion.label
                        key={option}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="sortBy"
                            checked={activeFilter.sortBy === option}
                            onChange={() => setActiveFilter({...activeFilter, sortBy: option})}
                            className="opacity-0 absolute h-5 w-5"
                          />
                          <div className={`border-2 rounded-full h-5 w-5 flex items-center justify-center transition-colors ${
                            activeFilter.sortBy === option 
                              ? 'border-red-500 bg-red-500' 
                              : 'border-gray-600 group-hover:border-red-400'
                          }`}>
                            {activeFilter.sortBy === option && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 bg-white rounded-full"
                              />
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>

                {/* Gender */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <FiUsers className="mr-2 text-red-500" />
                    Giới tính
                  </h3>
                  <div className="space-y-3">
                    {filters.gender.map((option) => (
                      <motion.label
                        key={option}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="gender"
                            checked={activeFilter.gender === option}
                            onChange={() => setActiveFilter({...activeFilter, gender: option})}
                            className="opacity-0 absolute h-5 w-5"
                          />
                          <div className={`border-2 rounded-full h-5 w-5 flex items-center justify-center transition-colors ${
                            activeFilter.gender === option 
                              ? 'border-red-500 bg-red-500' 
                              : 'border-gray-600 group-hover:border-red-400'
                          }`}>
                            {activeFilter.gender === option && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 bg-white rounded-full"
                              />
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>

                {/* Age Range */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <FiCalendar className="mr-2 text-red-500" />
                    Độ tuổi
                  </h3>
                  <div className="space-y-3">
                    {filters.ageRange.map((option) => (
                      <motion.label
                        key={option}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="ageRange"
                            checked={activeFilter.ageRange === option}
                            onChange={() => setActiveFilter({...activeFilter, ageRange: option})}
                            className="opacity-0 absolute h-5 w-5"
                          />
                          <div className={`border-2 rounded-full h-5 w-5 flex items-center justify-center transition-colors ${
                            activeFilter.ageRange === option 
                              ? 'border-red-500 bg-red-500' 
                              : 'border-gray-600 group-hover:border-red-400'
                          }`}>
                            {activeFilter.ageRange === option && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 bg-white rounded-full"
                              />
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end mt-8 space-x-4 border-t border-gray-700/50 pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-300 hover:text-white flex items-center"
                >
                  <FiRotateCcw className="mr-2" />
                  Đặt lại
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={applyFilters}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center shadow-lg shadow-red-600/20"
                >
                  <FiCheck className="mr-2" />
                  Áp dụng
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="animate-spin text-red-500 text-4xl" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Actors Grid with 3D Card Effect */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {actors.map((actor) => (
              <motion.div
                key={actor.tmdbId}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: -5,
                  z: 50
                }}
                className={`relative rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl ${
                  selectedActor === actor.tmdbId ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''
                }`}
                onClick={() => toggleActorDetails(actor.tmdbId)}
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <div className="aspect-[3/4] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                  <Image
                    src={actor.profilePath ? `https://image.tmdb.org/t/p/w500${actor.profilePath}` : '/images/placeholder-actor.jpg'}
                    alt={actor.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  
                  {/* Popularity Badge */}
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center z-20">
                    {Math.round(actor.popularity)}
                  </div>
                  
                  {/* Actor Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                    <h3 className="text-white font-medium truncate">{actor.name}</h3>
                    {actor.movies && actor.movies.length > 0 && (
                      <div className="flex items-center mt-1">
                        <FiStar className="text-yellow-500 mr-1 h-3 w-3" />
                        <span className="text-xs text-gray-300 truncate">
                          {actor.movies[0].movie.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expanded Actor Details */}
                <AnimatePresence>
                  {selectedActor === actor.tmdbId && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-sm p-4 overflow-y-auto z-30"
                    >
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActor(null);
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      >
                        <FiX />
                      </button>
                      
                      <div className="flex flex-col h-full">
                        <h3 className="text-xl font-bold text-white mb-2">{actor.name}</h3>
                        
                        {actor.birthday && (
                          <p className="text-sm text-gray-400 mb-2">
                            Born: {new Date(actor.birthday).toLocaleDateString('vi-VN')}
                            {actor.placeOfBirth && ` in ${actor.placeOfBirth}`}
                          </p>
                        )}
                        
                        <div className="text-sm text-gray-300 mb-4">
                          <p className="mb-2 line-clamp-6">{actor.biography || "No biography available."}</p>
                          
                          {actor.movies && actor.movies.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-white font-medium mb-1">Known for:</h4>
                              <ul className="list-disc list-inside">
                                {actor.movies.slice(0, 3).map((movieItem, index) => (
                                  <li key={index} className="text-gray-400">
                                    {movieItem.movie.title}
                                    {movieItem.character && ` as ${movieItem.character}`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto">
                          <Link 
                            href={`/actors/${actor.tmdbId}`}
                            className="inline-block w-full text-center py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* No Results */}
        {!isLoading && !error && actors.length === 0 && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">Không tìm thấy diễn viên nào phù hợp</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Xem tất cả diễn viên
            </button>
          </motion.div>
        )}
        
        {/* Pagination */}
        {!isLoading && !error && actors.length > 0 && totalPages > 1 && (
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex justify-center"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {/* Previous page button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                &lt;
              </motion.button>
              
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
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePageChange(1)}
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-gray-700"
                        >
                          1
                        </motion.button>
                        <span className="flex items-center text-gray-500">...</span>
                      </React.Fragment>
                    );
                  }
                  
                  if (index === 4 && currentPage < totalPages - 2) {
                    return (
                      <React.Fragment key={index}>
                        <span className="flex items-center text-gray-500">...</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePageChange(totalPages)}
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-gray-700"
                        >
                          {totalPages}
                        </motion.button>
                      </React.Fragment>
                    );
                  }
                }
                
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      pageNumber === currentPage 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </motion.button>
                );
              })}
              
              {/* Next page button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === totalPages 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                &gt;
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* Newsletter */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Nhận thông báo về diễn viên yêu thích</h2>
            <p className="text-gray-300 mb-6">
              Đăng ký để nhận thông báo về phim mới, sự kiện và tin tức mới nhất về các diễn viên yêu thích của bạn
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
        </motion.div>
      </div>
    </motion.div>
  );
};