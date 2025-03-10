"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiStar, FiFilm, FiCalendar, FiAward, FiHeart, FiShare2, FiBookmark, FiLoader } from 'react-icons/fi';
import { getActorDetails, Actor } from '@/app/api/actorApi';

export default function ActorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const actorId = params.id as string;
  
  const [actor, setActor] = useState<Actor | null>(null);
  const [activeTab, setActiveTab] = useState('filmography');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch actor data based on ID
  useEffect(() => {
    const fetchActor = async () => {
      if (!actorId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getActorDetails(actorId);
        if (response.success) {
          setActor(response.data);
        } else {
          setError("Không thể tải thông tin diễn viên");
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin diễn viên:", err);
        setError("Đã xảy ra lỗi khi tải thông tin diễn viên");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActor();
  }, [actorId]);

  // Animation variants
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
    }
  };

  // Calculate age
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'N/A';
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {error || "Không tìm thấy diễn viên"}
        </h1>
        <button 
          onClick={() => router.back()} 
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-16 pb-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm"
        >
          <FiArrowLeft />
        </motion.button>

        {/* Cover Image with Parallax */}
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${actor.profilePath}`}
            alt={`${actor.name} cover`}
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>

        {/* Actor Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-center gap-6">
            {/* Profile Image */}
            <motion.div 
              variants={itemVariants}
              className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${actor.profilePath}`}
                alt={actor.name}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Actor Details */}
            <div className="flex-1">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold text-white mb-2"
              >
                {actor.name}
              </motion.h1>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap items-center gap-4 text-gray-300 mb-4"
              >
                <div className="flex items-center">
                  <FiStar className="text-yellow-500 mr-1" />
                  <span>{actor.popularity.toFixed(1)}% Popularity</span>
                </div>
                {actor.birthday && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" />
                      <span>{calculateAge(actor.birthday)} tuổi</span>
                    </div>
                  </>
                )}
                {actor.placeOfBirth && (
                  <>
                    <span>•</span>
                    <div>{actor.placeOfBirth}</div>
                  </>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  <FiHeart className="mr-2" /> Yêu thích
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  <FiShare2 className="mr-2" /> Chia sẻ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  <FiBookmark className="mr-2" /> Lưu
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Biography and Info */}
          <div className="lg:col-span-2">
            {/* Biography */}
            <motion.div 
              variants={itemVariants}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Tiểu sử</h2>
              <div className="text-gray-300 space-y-4">
                {actor.biography ? (
                  actor.biography.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>Không có thông tin tiểu sử.</p>
                )}
              </div>
            </motion.div>

            {/* Tabs Navigation */}
            <motion.div 
              variants={itemVariants}
              className="mb-6 border-b border-gray-800"
            >
              <div className="flex overflow-x-auto scrollbar-hide">
                {['filmography'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab 
                        ? 'text-red-500 border-b-2 border-red-500' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'filmography' && 'Phim đã tham gia'}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'filmography' && (
                <motion.div
                  key="filmography"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {actor.movies && actor.movies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {actor.movies.map((movieItem, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          className="flex bg-gray-800/50 rounded-lg overflow-hidden"
                        >
                          <Link href={`/movies/${movieItem.movie.tmdbId}`} className="w-1/3 relative">
                            <div className="relative aspect-[2/3] h-full">
                              <Image
                                src={`https://image.tmdb.org/t/p/w300${movieItem.movie.posterPath}`}
                                alt={movieItem.movie.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>
                          <div className="w-2/3 p-4">
                            <Link href={`/movies/${movieItem.movie.tmdbId}`}>
                              <h3 className="font-bold text-white hover:text-red-500 transition-colors">
                                {movieItem.movie.title}
                              </h3>
                            </Link>
                            <div className="flex items-center mt-1">
                              <span className="text-gray-400 text-sm">
                                {new Date(movieItem.movie.releaseDate).getFullYear()}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mt-2 italic">
                              as {movieItem.character || 'Unknown'}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Không có thông tin phim.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Stats and Related */}
          <div>
            {/* Stats Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 mb-8"
            >
              <h2 className="text-xl font-bold mb-4">Thông tin</h2>
              
              <div className="space-y-4">
                {actor.birthday && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Ngày sinh</h3>
                    <p className="text-white">{formatDate(actor.birthday)}</p>
                  </div>
                )}
                
                {actor.placeOfBirth && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Nơi sinh</h3>
                    <p className="text-white">{actor.placeOfBirth}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-gray-400 text-sm">Độ phổ biến</h3>
                  <div className="mt-1 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                      <div 
                        style={{ width: `${Math.min(actor.popularity, 100)}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-500 to-purple-600"
                      ></div>
                    </div>
                    <span className="text-white text-sm mt-1">{actor.popularity.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              </motion.div>
            
            {/* Similar Actors - We can add this if API provides similar actors */}
            {/* <motion.div 
              variants={itemVariants}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">Diễn viên liên quan</h2>
              
              <div className="space-y-4">
                {similarActors.map((relatedActor) => (
                  <Link key={relatedActor.id} href={`/actors/${relatedActor.id}`}>
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-800/50"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={relatedActor.profilePath}
                          alt={relatedActor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{relatedActor.name}</h3>
                        <p className="text-gray-400 text-sm">{relatedActor.character}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div> */}
          </div>
        </div>
        
        {/* Notable Movies Section */}
        {actor.movies && actor.movies.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-6">Phim nổi bật</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {actor.movies.slice(0, 6).map((movieItem, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: -5,
                    z: 50
                  }}
                  className="relative rounded-lg overflow-hidden bg-gray-800"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  <Link href={`/movies/${movieItem.movie.tmdbId}`}>
                    <div className="aspect-[2/3] relative">
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${movieItem.movie.posterPath}`}
                        alt={movieItem.movie.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-medium text-sm truncate">{movieItem.movie.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-300">
                            {new Date(movieItem.movie.releaseDate).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Newsletter Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Nhận thông báo về {actor.name}</h2>
            <p className="text-gray-300 mb-6">
              Đăng ký để nhận thông báo về phim mới, sự kiện và tin tức mới nhất về {actor.name}
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