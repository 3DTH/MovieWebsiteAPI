"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiChevronDown, FiArrowRight } from 'react-icons/fi';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterProps {
  types: FilterOption[];
  genres: FilterOption[];
  years: FilterOption[];
  countries: FilterOption[];
  ratings: FilterOption[];
  versions: FilterOption[];
  sortOptions: FilterOption[];
  onFilterChange: (filters: {
    genres: string;
    years: string;
    countries: string;
    sort: string;
    type: string;
    rating: string;
    version: string;
  }) => void;
}

const Filter: React.FC<FilterProps> = ({
  types,
  genres,
  years,
  countries,
  ratings,
  versions,
  sortOptions,
  onFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>(sortOptions[0]?.id || 'newest');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  
  const toggleFilter = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'genre':
        setSelectedGenre(value);
        break;
      case 'year':
        setSelectedYear(value);
        break;
      case 'country':
        setSelectedCountry(value);
        break;
      case 'sort':
        setSelectedSort(value);
        break;
      case 'type':
        setSelectedType(value);
        break;
      case 'rating':
        setSelectedRating(value);
        break;
      case 'version':
        setSelectedVersion(value);
        break;
      default:
        break;
    }
  };
  
  const applyFilters = () => {
    onFilterChange({
      genres: selectedGenre,
      years: selectedYear,
      countries: selectedCountry,
      sort: selectedSort,
      type: selectedType,
      rating: selectedRating,
      version: selectedVersion
    });
  };
  
  const closeFilter = () => {
    setIsExpanded(false);
  };
  
  return (
    <div className="v-filter mb-6">
      {/* Filter Toggle Button */}
      <div 
        className={`filter-toggle flex items-center justify-center space-x-2 p-3 bg-gray-800 rounded-lg cursor-pointer ${isExpanded ? 'toggled' : ''}`}
        onClick={toggleFilter}
      >
        <FiFilter className="text-yellow-500" />
        <span className="text-white font-medium">Bộ lọc</span>
        <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      
      {/* Filter Elements */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="filter-elements bg-gray-800 mt-2 rounded-lg p-4 overflow-hidden"
          >
            {/* Countries */}
            <div className="fe-row flex flex-col md:flex-row border-b border-gray-700 pb-4 mb-4">
              <div className="fe-name text-gray-400 w-full md:w-32 mb-2 md:mb-0">Quốc gia:</div>
              <div className="fe-results flex flex-wrap gap-2">
                <div 
                  className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedCountry === 'all' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => handleFilterChange('country', 'all')}
                >
                  Tất cả
                </div>
                {countries.map((country) => (
                  <div 
                    key={country.id}
                    className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedCountry === country.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleFilterChange('country', country.id)}
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Types */}
            <div className="fe-row flex flex-col md:flex-row border-b border-gray-700 pb-4 mb-4">
              <div className="fe-name text-gray-400 w-full md:w-32 mb-2 md:mb-0">Loại phim:</div>
              <div className="fe-results flex flex-wrap gap-2">
                <div 
                  className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedType === 'all' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => handleFilterChange('type', 'all')}
                >
                  Tất cả
                </div>
                {types.map((type) => (
                  <div 
                    key={type.id}
                    className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedType === type.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleFilterChange('type', type.id)}
                  >
                    {type.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Ratings */}
            <div className="fe-row flex flex-col md:flex-row border-b border-gray-700 pb-4 mb-4">
              <div className="fe-name text-gray-400 w-full md:w-32 mb-2 md:mb-0">Xếp hạng:</div>
              <div className="fe-results flex flex-wrap gap-2">
                <div 
                  className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedRating === 'all' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => handleFilterChange('rating', 'all')}
                >
                  Tất cả
                </div>
                {ratings.map((rating) => (
                  <div 
                    key={rating.id}
                    className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedRating === rating.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleFilterChange('rating', rating.id)}
                  >
                    {rating.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Genres */}
            <div className="fe-row flex flex-col md:flex-row border-b border-gray-700 pb-4 mb-4">
              <div className="fe-name text-gray-400 w-full md:w-32 mb-2 md:mb-0">Thể loại:</div>
              <div className="fe-results flex flex-wrap gap-2">
                <div 
                  className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedGenre === 'all' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => handleFilterChange('genre', 'all')}
                >
                  Tất cả
                </div>
                {genres.map((genre) => (
                  <div 
                    key={genre.id}
                    className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedGenre === genre.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleFilterChange('genre', genre.id)}
                  >
                    {genre.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Versions */}
            <div className="fe-row flex flex-col md:flex-row border-b border-gray-700 pb-4 mb-4">
              <div className="fe-name text-gray-400 w-full md:w-32 mb-2 md:mb-0">Phiên bản:</div>
              <div className="fe-results flex flex-wrap gap-2">
                <div 
                  className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedVersion === 'all' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => handleFilterChange('version', 'all')}
                >
                  Tất cả
                </div>
                {versions.map((version) => (
                  <div 
                    key={version.id}
                    className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedVersion === version.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleFilterChange('version', version.id)}
                  >
                    {version.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Years */}
            <div className="fe-row flex flex-col md:flex-row border-b border-gray-700 pb-4 mb-4">
              <div className="fe-name text-gray-400 w-full md:w-32 mb-2 md:mb-0">Năm sản xuất:</div>
              <div className="fe-results flex flex-wrap gap-2">
                <div 
                  className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedYear === 'all' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => handleFilterChange('year', 'all')}
                >
                  Tất cả
                </div>
                {years.map((year) => (
                  <div 
                    key={year.id}
                    className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedYear === year.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleFilterChange('year', year.id)}
                  >
                    {year.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sort */}
            <div className="fe-row flex flex-col md:flex-row border-b border-gray-700 pb-4 mb-4">
              <div className="fe-name text-gray-400 w-full md:w-32 mb-2 md:mb-0">Sắp xếp:</div>
              <div className="fe-results flex flex-wrap gap-2">
                {sortOptions.map((sort) => (
                  <div 
                    key={sort.id}
                    className={`item px-3 py-1.5 rounded-full cursor-pointer ${selectedSort === sort.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleFilterChange('sort', sort.id)}
                  >
                    {sort.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Buttons */}
            <div className="fe-row fe-row-end flex flex-col md:flex-row">
              <div className="fe-name text-gray-400 w-full md:w-32 mb-2 md:mb-0">&nbsp;</div>
              <div className="fe-buttons flex space-x-3">
                <button 
                  type="button" 
                  className="btn btn-rounded bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full flex items-center"
                  onClick={applyFilters}
                >
                  Lọc kết quả <FiArrowRight className="ml-2" />
                </button>
                <button 
                  type="button" 
                  className="btn btn-rounded bg-transparent border border-gray-600 text-gray-300 hover:text-white px-6 py-2 rounded-full"
                  onClick={closeFilter}
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filter;