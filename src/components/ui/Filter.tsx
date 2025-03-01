"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiChevronDown, FiX, FiCheck } from 'react-icons/fi';

interface FilterOption {
  id: string;
  name: string;
}

// Cập nhật interface để thêm types
interface FilterProps {
  types: FilterOption[];
  genres: FilterOption[];
  years: FilterOption[];
  countries: FilterOption[];
  sortOptions: FilterOption[];
  selectedType?: string;
  onFilterChange: (filters: {
    genres: string[];
    years: string[];
    countries: string[];
    sort: string;
    type: string;
  }) => void;
}

const Filter: React.FC<FilterProps> = ({
  types,
  genres,
  years,
  countries,
  sortOptions,
  selectedType = 'all',
  onFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>(sortOptions[0]?.id || '');
  const [selectedMovieType, setSelectedMovieType] = useState<string>(selectedType);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Cập nhật selectedMovieType khi prop thay đổi
  useEffect(() => {
    setSelectedMovieType(selectedType);
  }, [selectedType]);
  
  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };
  const handleGenreChange = (genreId: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };
  const handleYearChange = (yearId: string) => {
    setSelectedYears(prev => {
      if (prev.includes(yearId)) {
        return prev.filter(id => id !== yearId);
      } else {
        return [...prev, yearId];
      }
    });
  };
  const handleCountryChange = (countryId: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryId)) {
        return prev.filter(id => id !== countryId);
      } else {
        return [...prev, countryId];
      }
    });
  };
  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    setActiveDropdown(null);
  };
  // Thêm hàm xử lý thay đổi loại phim
  const handleTypeChange = (typeId: string) => {
    setSelectedMovieType(typeId);
    setActiveDropdown(null);
    applyFilters(selectedGenres, selectedYears, selectedCountries, selectedSort, typeId);
  };
  // Thêm hàm resetFilters
  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedYears([]);
    setSelectedCountries([]);
    setSelectedSort(sortOptions[0]?.id || '');
    // Không reset selectedMovieType để giữ lại loại phim hiện tại
    
    applyFilters([], [], [], sortOptions[0]?.id || '', selectedMovieType);
  };
  // Cập nhật hàm applyFilters để bao gồm type
  const applyFilters = (
    genres: string[] = selectedGenres,
    years: string[] = selectedYears,
    countries: string[] = selectedCountries,
    sort: string = selectedSort,
    type: string = selectedMovieType
  ) => {
    onFilterChange({
      genres,
      years,
      countries,
      sort,
      type,
    });
  };
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg mb-8">
      {/* Filter Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FiFilter className="text-red-500 mr-2" />
          <h3 className="text-white font-medium">Bộ lọc</h3>
        </div>
        <FiChevronDown 
          className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </div>
      
      {/* Filter Content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Movie Type Filter */}
            <div className="relative">
              <button
                className="w-full p-3 bg-gray-800 rounded-lg text-left flex items-center justify-between"
                onClick={() => toggleDropdown('types')}
              >
                <span className="text-gray-300">
                  {types.find(t => t.id === selectedMovieType)?.name || 'Loại phim'}
                </span>
                <FiChevronDown className={`transition-transform ${activeDropdown === 'types' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'types' && (
                <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {types.map((type) => (
                      <button
                        key={type.id}
                        className={`w-full text-left p-2 rounded-md flex items-center ${
                          selectedMovieType === type.id ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => handleTypeChange(type.id)}
                      >
                        <span className="ml-2">{type.name}</span>
                        {selectedMovieType === type.id && (
                          <FiCheck className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Genres Filter */}
            <div className="relative">
              <button
                className="w-full p-3 bg-gray-800 rounded-lg text-left flex items-center justify-between"
                onClick={() => toggleDropdown('genres')}
              >
                <span className="text-gray-300">
                  {selectedGenres.length > 0 
                    ? `Thể loại (${selectedGenres.length})` 
                    : 'Thể loại'}
                </span>
                <FiChevronDown className={`transition-transform ${activeDropdown === 'genres' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'genres' && (
                <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        className={`w-full text-left p-2 rounded-md flex items-center ${
                          selectedGenres.includes(genre.id) ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => handleGenreChange(genre.id)}
                      >
                        <span className="ml-2">{genre.name}</span>
                        {selectedGenres.includes(genre.id) && (
                          <FiCheck className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Years Filter */}
            <div className="relative">
              <button
                className="w-full p-3 bg-gray-800 rounded-lg text-left flex items-center justify-between"
                onClick={() => toggleDropdown('years')}
              >
                <span className="text-gray-300">
                  {selectedYears.length > 0 
                    ? `Năm (${selectedYears.length})` 
                    : 'Năm'}
                </span>
                <FiChevronDown className={`transition-transform ${activeDropdown === 'years' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'years' && (
                <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {years.map((year) => (
                      <button
                        key={year.id}
                        className={`w-full text-left p-2 rounded-md flex items-center ${
                          selectedYears.includes(year.id) ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => handleYearChange(year.id)}
                      >
                        <span className="ml-2">{year.name}</span>
                        {selectedYears.includes(year.id) && (
                          <FiCheck className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Countries Filter */}
            <div className="relative">
              <button
                className="w-full p-3 bg-gray-800 rounded-lg text-left flex items-center justify-between"
                onClick={() => toggleDropdown('countries')}
              >
                <span className="text-gray-300">
                  {selectedCountries.length > 0 
                    ? `Quốc gia (${selectedCountries.length})` 
                    : 'Quốc gia'}
                </span>
                <FiChevronDown className={`transition-transform ${activeDropdown === 'countries' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'countries' && (
                <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {countries.map((country) => (
                      <button
                        key={country.id}
                        className={`w-full text-left p-2 rounded-md flex items-center ${
                          selectedCountries.includes(country.id) ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => handleCountryChange(country.id)}
                      >
                        <span className="ml-2">{country.name}</span>
                        {selectedCountries.includes(country.id) && (
                          <FiCheck className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sort Options */}
            <div className="relative">
              <button
                className="w-full p-3 bg-gray-800 rounded-lg text-left flex items-center justify-between"
                onClick={() => toggleDropdown('sort')}
              >
                <span className="text-gray-300">
                  {sortOptions.find(o => o.id === selectedSort)?.name || 'Sắp xếp theo'}
                </span>
                <FiChevronDown className={`transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'sort' && (
                <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`w-full text-left p-2 rounded-md flex items-center ${
                          selectedSort === option.id ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => handleSortChange(option.id)}
                      >
                        <span className="ml-2">{option.name}</span>
                        {selectedSort === option.id && (
                          <FiCheck className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Filter Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Đặt lại
            </button>
            <button
              onClick={() => applyFilters()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Filter;