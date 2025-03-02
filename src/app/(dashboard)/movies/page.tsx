"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiList, FiColumns, FiLoader } from 'react-icons/fi';
import Filter from '@/components/ui/Filter';
import MovieCard from '@/components/ui/MovieCard';
import MovieListItem from '@/components/ui/MovieListItem';
import MovieGridCard from '@/components/ui/MovieGridCard';

// Sample data - replace with your actual API calls
const genres = [
  { id: 'action', name: 'Hành động' },
  { id: 'comedy', name: 'Hài hước' },
  { id: 'drama', name: 'Chính kịch' },
  { id: 'horror', name: 'Kinh dị' },
  { id: 'romance', name: 'Lãng mạn' },
  { id: 'scifi', name: 'Khoa học viễn tưởng' },
  { id: 'fantasy', name: 'Thần thoại' },
  { id: 'thriller', name: 'Giật gân' },
];

const years = [
  { id: '2023', name: '2023' },
  { id: '2022', name: '2022' },
  { id: '2021', name: '2021' },
  { id: '2020', name: '2020' },
  { id: '2019', name: '2019' },
  { id: '2018', name: '2018' },
  { id: '2010-2017', name: '2010-2017' },
  { id: '2000-2009', name: '2000-2009' },
  { id: 'before-2000', name: 'Trước 2000' },
];

const countries = [
  { id: 'us', name: 'Mỹ' },
  { id: 'kr', name: 'Hàn Quốc' },
  { id: 'cn', name: 'Trung Quốc' },
  { id: 'jp', name: 'Nhật Bản' },
  { id: 'vn', name: 'Việt Nam' },
  { id: 'th', name: 'Thái Lan' },
  { id: 'uk', name: 'Anh' },
  { id: 'fr', name: 'Pháp' },
];

const sortOptions = [
  { id: 'newest', name: 'Mới nhất' },
  { id: 'popular', name: 'Phổ biến nhất' },
  { id: 'rating', name: 'Đánh giá cao' },
  { id: 'name-asc', name: 'Tên A-Z' },
  { id: 'name-desc', name: 'Tên Z-A' },
];

const types = [
  { id: 'all', name: 'Tất cả' },
  { id: 'movie', name: 'Phim lẻ' },
  { id: 'series', name: 'Phim bộ' },
  { id: 'new', name: 'Phim mới' },
];

// Đoạn code này chỉ để tao dữ liệu mẫu các phim
const sampleMovies = Array(100).fill(null).map((_, index) => ({
  id: `movie-${index}`,
  title: `Movie Title ${index + 1}`,
  poster: `/images/placeholder-${(index % 5) + 1}.jpg`,
  year: 2023 - (index % 5),
  rating: (Math.random() * 2 + 3).toFixed(1),
  duration: `${Math.floor(Math.random() * 60) + 90} min`,
  type: index % 3 === 0 ? 'series' : 'movie',
  isNew: index % 7 === 0,
  genres: [genres[index % genres.length].id, genres[(index + 2) % genres.length].id],
  country: countries[index % countries.length].id,
}));

type ViewMode = 'grid' | 'list' | 'masonry';

const MoviesPage = () => {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get('type');
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [movies, setMovies] = useState(sampleMovies);
  const [filteredMovies, setFilteredMovies] = useState(sampleMovies);
  const [isLoading, setIsLoading] = useState(false);
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(30);
  // Thêm các dữ liệu mẫu cho ratings và versions
  const ratings = [
    { id: 'p', name: 'P (Mọi lứa tuổi)' },
    { id: 'k', name: 'K (Dưới 13 tuổi)' },
    { id: 't13', name: 'T13 (13 tuổi trở lên)' },
    { id: 't16', name: 'T16 (16 tuổi trở lên)' },
    { id: 't18', name: 'T18 (18 tuổi trở lên)' },
  ];

  const versions = [
    { id: 'sub', name: 'Phụ đề' },
    { id: 'dub', name: 'Lồng tiếng' },
    { id: 'thuyetminh_bac', name: 'Thuyết minh giọng Bắc' },
    { id: 'thuyetminh_nam', name: 'Thuyết minh giọng Nam' },
  ];
  const [activeFilters, setActiveFilters] = useState({
    genres: [] as string[],
    years: [] as string[],
    countries: [] as string[],
    sort: 'newest',
    type: typeFromUrl || 'all',
    rating: 'all',
    version: 'all',
  });
  // Effect to handle URL params for type filter
  useEffect(() => {
    if (typeFromUrl) {
      setActiveFilters(prev => ({
        ...prev,
        type: typeFromUrl
      }));
    }
  }, [typeFromUrl]);
  // Effect to apply filters
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = [...movies];
      
      // Filter by type
      if (activeFilters.type !== 'all') {
        if (activeFilters.type === 'new') {
          results = results.filter(movie => movie.isNew);
        } else {
          results = results.filter(movie => movie.type === activeFilters.type);
        }
      }
      
      // Filter by genres
      if (activeFilters.genres.length > 0) {
        results = results.filter(movie => 
          movie.genres.some(genre => activeFilters.genres.includes(genre))
        );
      }
      
      // Filter by years
      if (activeFilters.years.length > 0) {
        results = results.filter(movie => {
          const yearStr = movie.year.toString();
          return activeFilters.years.some(yearFilter => {
            if (yearFilter.includes('-')) {
              const [start, end] = yearFilter.split('-').map(Number);
              return movie.year >= start && movie.year <= end;
            }
            if (yearFilter === 'before-2000') {
              return movie.year < 2000;
            }
            return yearStr === yearFilter;
          });
        });
      }
      
      // Filter by countries
      if (activeFilters.countries.length > 0) {
        results = results.filter(movie => 
          activeFilters.countries.includes(movie.country)
        );
      }
      
      // Sort results
      switch (activeFilters.sort) {
        case 'newest':
          results.sort((a, b) => b.year - a.year);
          break;
        case 'popular':
          results.sort(() => Math.random() - 0.5); // Random for demo
          break;
        case 'rating':
          results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
          break;
        case 'name-asc':
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          results.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
      
      setFilteredMovies(results);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [activeFilters, movies]);
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
      genres: filters.genres === 'all' ? [] : [filters.genres],
      years: filters.years === 'all' ? [] : [filters.years],
      countries: filters.countries === 'all' ? [] : [filters.countries],
      sort: filters.sort,
      type: filters.type,
      rating: filters.rating,
      version: filters.version
    });
  };
  // Add function to handle page changes
  const handlePageChange = (pageNumber: number) => {
    // Only change page if it's different
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };
  // Calculate pagination values
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  // Modify renderMovies function to use currentMovies instead of filteredMovies
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
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">Không tìm thấy phim nào</h3>
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
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {currentMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
  
          {viewMode === 'list' && (
            <div className="space-y-4">
              {currentMovies.map(movie => (
                <MovieListItem key={movie.id} movie={movie} />
              ))}
            </div>
          )}
  
          {viewMode === 'masonry' && (
            <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
              {currentMovies.map(movie => (
                <div key={movie.id} className="break-inside-avoid">
                  <MovieGridCard movie={movie} height={Math.floor(Math.random() * 100) + 350} />
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
              ${currentPage === 1 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-800 text-white hover:bg-red-600 transition-colors'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
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
                  ${currentPage === pageNumber 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-white hover:bg-red-600 transition-colors'}`}
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
              ${currentPage === totalPages 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-800 text-white hover:bg-red-600 transition-colors'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
          {activeFilters.type === 'all' ? 'Tất cả phim' : 
           activeFilters.type === 'movie' ? 'Phim lẻ' : 
           activeFilters.type === 'series' ? 'Phim bộ' : 'Phim mới'}
        </h1>
        
        <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Grid view"
          >
            <FiGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="List view"
          >
            <FiList size={20} />
          </button>
          <button
            onClick={() => setViewMode('masonry')}
            className={`p-2 rounded-md ${viewMode === 'masonry' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Masonry view"
          >
            <FiColumns size={20} />
          </button>
        </div>
      </div>
  
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
          <span className="font-semibold text-white">{filteredMovies.length} phim</span>
          
          {activeFilters.genres.length > 0 && (
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
              <span className="text-gray-300 mr-1">Thể loại:</span>
              <span className="text-red-500">
                {activeFilters.genres.map(g => 
                  genres.find(genre => genre.id === g)?.name
                ).join(', ')}
              </span>
            </div>
          )}
          
          {activeFilters.years.length > 0 && (
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
              <span className="text-gray-300 mr-1">Năm:</span>
              <span className="text-red-500">
                {activeFilters.years.map(y => 
                  years.find(year => year.id === y)?.name
                ).join(', ')}
              </span>
            </div>
          )}
          
          {activeFilters.countries.length > 0 && (
            <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
              <span className="text-gray-300 mr-1">Quốc gia:</span>
              <span className="text-red-500">
                {activeFilters.countries.map(c => 
                  countries.find(country => country.id === c)?.name
                ).join(', ')}
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
          Hiển thị {indexOfFirstMovie + 1}-{Math.min(indexOfLastMovie, filteredMovies.length)} trong số {filteredMovies.length} phim
        </div>
      )}
    </div>
  );
};

export default MoviesPage;