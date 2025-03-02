"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiFilter, FiStar, FiChevronDown, FiX } from 'react-icons/fi';

// Sample data - will be replaced with API data later
const actorsData = [
  {
    id: 1,
    name: 'Robert Downey Jr.',
    profilePath: '/actors/robert-downey-jr.jpg',
    popularity: 98,
    knownFor: ['Iron Man', 'Avengers', 'Sherlock Holmes'],
    biography: 'Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles, before a resurgence of commercial success later in his career.',
  },
  {
    id: 2,
    name: 'Scarlett Johansson',
    profilePath: '/actors/scarlett-johansson.jpg',
    popularity: 95,
    knownFor: ['Black Widow', 'Lucy', 'Marriage Story'],
    biography: 'Scarlett Ingrid Johansson is an American actress. She was the world\'s highest-paid actress in 2018 and 2019, and has featured multiple times on the Forbes Celebrity 100 list.',
  },
  {
    id: 3,
    name: 'Leonardo DiCaprio',
    profilePath: '/actors/leonardo-dicaprio.jpg',
    popularity: 97,
    knownFor: ['Titanic', 'The Revenant', 'Inception'],
    biography: 'Leonardo Wilhelm DiCaprio is an American actor, film producer, and environmentalist. He has often played unconventional roles, particularly in biopics and period films.',
  },
  {
    id: 4,
    name: 'Margot Robbie',
    profilePath: '/actors/margot-robbie.jpg',
    popularity: 94,
    knownFor: ['Barbie', 'The Wolf of Wall Street', 'I, Tonya'],
    biography: 'Margot Elise Robbie is an Australian actress and producer. Known for her roles in both blockbusters and independent films, she has received several accolades, including nominations for two Academy Awards.',
  },
  {
    id: 5,
    name: 'Tom Hanks',
    profilePath: '/actors/tom-hanks.jpg',
    popularity: 96,
    knownFor: ['Forrest Gump', 'Saving Private Ryan', 'Cast Away'],
    biography: 'Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide.',
  },
  {
    id: 6,
    name: 'Jennifer Lawrence',
    profilePath: '/actors/jennifer-lawrence.jpg',
    popularity: 93,
    knownFor: ['The Hunger Games', 'Silver Linings Playbook', 'X-Men'],
    biography: 'Jennifer Shrader Lawrence is an American actress. The world\'s highest-paid actress in 2015 and 2016, her films have grossed over $6 billion worldwide.',
  },
  {
    id: 7,
    name: 'Denzel Washington',
    profilePath: '/actors/denzel-washington.jpg',
    popularity: 95,
    knownFor: ['Training Day', 'Malcolm X', 'The Equalizer'],
    biography: 'Denzel Hayes Washington Jr. is an American actor, director, and producer. He is widely regarded as one of the greatest actors of his generation.',
  },
  {
    id: 8,
    name: 'Emma Stone',
    profilePath: '/actors/emma-stone.jpg',
    popularity: 92,
    knownFor: ['La La Land', 'The Favourite', 'Cruella'],
    biography: 'Emily Jean "Emma" Stone is an American actress. She is the recipient of various accolades, including an Academy Award, a British Academy Film Award, and a Golden Globe Award.',
  },
  {
    id: 9,
    name: 'Brad Pitt',
    profilePath: '/actors/brad-pitt.jpg',
    popularity: 94,
    knownFor: ['Fight Club', 'Once Upon a Time in Hollywood', 'Troy'],
    biography: 'William Bradley Pitt is an American actor and film producer. He is the recipient of various accolades, including two Academy Awards, a British Academy Film Award, and two Golden Globe Awards.',
  },
  {
    id: 10,
    name: 'Meryl Streep',
    profilePath: '/actors/meryl-streep.jpg',
    popularity: 97,
    knownFor: ['The Devil Wears Prada', 'Sophie\'s Choice', 'Mamma Mia!'],
    biography: 'Mary Louise "Meryl" Streep is an American actress. Often described as "the best actress of her generation", Streep is particularly known for her versatility and accent adaptability.',
  },
  {
    id: 11,
    name: 'Dwayne Johnson',
    profilePath: '/actors/dwayne-johnson.jpg',
    popularity: 96,
    knownFor: ['Jumanji', 'Fast & Furious', 'Moana'],
    biography: 'Dwayne Douglas Johnson, also known by his ring name The Rock, is an American actor, producer, businessman, and former professional wrestler.',
  },
  {
    id: 12,
    name: 'Viola Davis',
    profilePath: '/actors/viola-davis.jpg',
    popularity: 91,
    knownFor: ['The Help', 'Fences', 'How to Get Away with Murder'],
    biography: 'Viola Davis is an American actress and producer. The recipient of numerous accolades, she is the only African-American to achieve the "Triple Crown of Acting".',
  },
];

// Filter options
const filters = {
  sortBy: ['Popularity', 'Name A-Z', 'Name Z-A'],
  gender: ['All', 'Male', 'Female'],
  ageRange: ['All', 'Under 30', '30-50', 'Over 50'],
};

export default function ActorsPage() {
  const [actors, setActors] = useState(actorsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState({
    sortBy: 'Popularity',
    gender: 'All',
    ageRange: 'All',
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const filtered = actorsData.filter(actor => 
        actor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setActors(filtered);
    } else {
      setActors(actorsData);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...actorsData];
    
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
    setActors([...actorsData].sort((a, b) => b.popularity - a.popularity));
    setIsFilterOpen(false);
  };

  // Handle actor selection
  const toggleActorDetails = (id: number) => {
    setSelectedActor(selectedActor === id ? null : id);
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-gray-800/70 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sort By */}
                <div>
                  <h3 className="text-white font-medium mb-3">Sắp xếp theo</h3>
                  <div className="space-y-2">
                    {filters.sortBy.map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="sortBy"
                          checked={activeFilter.sortBy === option}
                          onChange={() => setActiveFilter({...activeFilter, sortBy: option})}
                          className="form-radio h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700"
                        />
                        <span className="ml-2 text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <h3 className="text-white font-medium mb-3">Giới tính</h3>
                  <div className="space-y-2">
                    {filters.gender.map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          checked={activeFilter.gender === option}
                          onChange={() => setActiveFilter({...activeFilter, gender: option})}
                          className="form-radio h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700"
                        />
                        <span className="ml-2 text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <h3 className="text-white font-medium mb-3">Độ tuổi</h3>
                  <div className="space-y-2">
                    {filters.ageRange.map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="ageRange"
                          checked={activeFilter.ageRange === option}
                          onChange={() => setActiveFilter({...activeFilter, ageRange: option})}
                          className="form-radio h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700"
                        />
                        <span className="ml-2 text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Đặt lại
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Áp dụng
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actors Grid with 3D Card Effect */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {actors.map((actor) => (
            <motion.div
              key={actor.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: -5,
                z: 50
              }}
              className={`relative rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl ${
                selectedActor === actor.id ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => toggleActorDetails(actor.id)}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <div className="aspect-[3/4] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <Image
                  src={actor.profilePath}
                  alt={actor.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                
                {/* Popularity Badge */}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center z-20">
                  {actor.popularity}
                </div>
                
                {/* Actor Name */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                  <h3 className="text-white font-medium truncate">{actor.name}</h3>
                  <div className="flex items-center mt-1">
                    <FiStar className="text-yellow-500 mr-1 h-3 w-3" />
                    <span className="text-xs text-gray-300">
                      {actor.knownFor[0]}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Expanded Actor Details */}
              <AnimatePresence>
                {selectedActor === actor.id && (
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
                      
                      <div className="text-sm text-gray-300 mb-4">
                        <p className="mb-2">{actor.biography}</p>
                        <div className="mt-4">
                          <h4 className="text-white font-medium mb-1">Nổi tiếng với:</h4>
                          <ul className="list-disc list-inside">
                            {actor.knownFor.map((movie, index) => (
                              <li key={index} className="text-gray-400">{movie}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <Link 
                          href={`/actors/${actor.id}`}
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
        
        {/* No Results */}
        {actors.length === 0 && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">Không tìm thấy diễn viên nào phù hợp</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActors(actorsData);
              }}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Xem tất cả diễn viên
            </button>
          </motion.div>
        )}
        
        {/* Pagination */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 flex justify-center"
        >
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  page === 1 ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {page}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              ...
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              10
            </motion.button>
          </div>
        </motion.div>
        
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
}