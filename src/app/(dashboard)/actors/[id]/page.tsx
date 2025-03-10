"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiStar, FiFilm, FiCalendar, FiAward, FiHeart, FiShare2, FiBookmark } from 'react-icons/fi';

// Sample actor data - will be replaced with API data later
const actorData = {
  id: 1,
  name: 'Robert Downey Jr.',
  profilePath: '/actors/robert-downey-jr.jpg',
  coverPath: '/actors/covers/robert-downey-jr-cover.jpg',
  birthDate: '1965-04-04',
  birthPlace: 'New York City, New York, USA',
  biography: `Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles, before a resurgence of commercial success later in his career.

Born in Manhattan, New York City, and raised in Greenwich Village, Downey appeared in his father's film Pound at the age of five. He had roles in several coming-of-age films in the 1980s and rose to stardom with his role as Iron Man in the Marvel Cinematic Universe, appearing in ten films as the character from 2008 to 2019.

Downey has earned numerous accolades throughout his career, including a BAFTA Award, three Golden Globe Awards, and a Screen Actors Guild Award. He was named by Time magazine among the 100 most influential people in the world in 2008, and from 2013 to 2015, he was listed by Forbes as Hollywood's highest-paid actor.`,
  popularity: 98,
  awards: [
    'Academy Award Nomination for Best Actor (Chaplin)',
    'Golden Globe Award for Best Supporting Actor (Sherlock Holmes)',
    'BAFTA Award for Best Actor (Chaplin)',
    'Screen Actors Guild Award for Outstanding Performance by a Male Actor in a Supporting Role (Tropic Thunder)'
  ],
  socialMedia: {
    instagram: '@robertdowneyjr',
    twitter: '@RobertDowneyJr',
    facebook: 'robertdowneyjr'
  },
  filmography: [
    {
      id: 101,
      title: 'Iron Man',
      year: 2008,
      character: 'Tony Stark / Iron Man',
      posterPath: '/movies/iron-man.jpg',
      rating: 7.9
    },
    {
      id: 102,
      title: 'Avengers: Endgame',
      year: 2019,
      character: 'Tony Stark / Iron Man',
      posterPath: '/movies/avengers-endgame.jpg',
      rating: 8.4
    },
    {
      id: 103,
      title: 'Sherlock Holmes',
      year: 2009,
      character: 'Sherlock Holmes',
      posterPath: '/movies/sherlock-holmes.jpg',
      rating: 7.6
    },
    {
      id: 104,
      title: 'Tropic Thunder',
      year: 2008,
      character: 'Kirk Lazarus',
      posterPath: '/movies/tropic-thunder.jpg',
      rating: 7.0
    },
    {
      id: 105,
      title: 'Chaplin',
      year: 1992,
      character: 'Charlie Chaplin',
      posterPath: '/movies/chaplin.jpg',
      rating: 7.6
    },
    {
      id: 106,
      title: 'Due Date',
      year: 2010,
      character: 'Peter Highman',
      posterPath: '/movies/due-date.jpg',
      rating: 6.5
    }
  ],
  knownFor: ['Iron Man', 'Avengers', 'Sherlock Holmes'],
  trivia: [
    'Downey was born in Manhattan, New York City, the younger of two children.',
    'His father, Robert Downey Sr., is an actor and filmmaker, while his mother, Elsie Ann, was an actress.',
    'Downey made his acting debut at the age of five in his father\'s film Pound (1970).',
    'He attended the Stagedoor Manor Performing Arts Training Center in upstate New York as a teenager.',
    'Downey was a cast member of Saturday Night Live for the 1985-1986 season.'
  ],
  relatedActors: [
    {
      id: 2,
      name: 'Chris Evans',
      profilePath: '/actors/chris-evans.jpg',
      character: 'Steve Rogers / Captain America'
    },
    {
      id: 3,
      name: 'Scarlett Johansson',
      profilePath: '/actors/scarlett-johansson.jpg',
      character: 'Natasha Romanoff / Black Widow'
    },
    {
      id: 4,
      name: 'Jude Law',
      profilePath: '/actors/jude-law.jpg',
      character: 'Dr. John Watson'
    }
  ]
};

export default function ActorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [actor, setActor] = useState(actorData);
  const [activeTab, setActiveTab] = useState('filmography');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch actor data based on ID
  useEffect(() => {
    // Simulate API call
    const fetchActor = async () => {
      setIsLoading(true);
      // In a real app, you would fetch data from an API
      // const response = await fetch(`/api/actors/${params.id}`);
      // const data = await response.json();
      // setActor(data);
      
      // For now, we'll just use the sample data
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };

    fetchActor();
  }, [params.id]);

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
            src={actor.coverPath}
            alt={`${actor.name} cover`}
            fill
            priority
            className="object-cover"
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
                src={actor.profilePath}
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
                  <span>{actor.popularity}% Popularity</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  <span>{calculateAge(actor.birthDate)} tuổi</span>
                </div>
                <span>•</span>
                <div>{actor.birthPlace}</div>
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
                {actor.biography.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            {/* Tabs Navigation */}
            <motion.div 
              variants={itemVariants}
              className="mb-6 border-b border-gray-800"
            >
              <div className="flex overflow-x-auto scrollbar-hide">
                {['filmography', 'awards', 'trivia'].map((tab) => (
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
                    {tab === 'awards' && 'Giải thưởng'}
                    {tab === 'trivia' && 'Thông tin thêm'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actor.filmography.map((film) => (
                      <motion.div
                        key={film.id}
                        whileHover={{ scale: 1.03 }}
                        className="flex bg-gray-800/50 rounded-lg overflow-hidden"
                      >
                        <div className="w-1/3 relative">
                          <Image
                            src={film.posterPath}
                            alt={film.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                        <h3 className="font-bold text-white">{film.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-gray-400 text-sm">{film.year}</span>
                            <span className="mx-2 text-gray-500">•</span>
                            <div className="flex items-center">
                              <FiStar className="text-yellow-500 mr-1 h-3 w-3" />
                              <span className="text-sm">{film.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mt-2 italic">
                            as {film.character}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'awards' && (
                <motion.div
                  key="awards"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/50 rounded-xl p-6"
                >
                  <ul className="space-y-4">
                    {actor.awards.map((award, index) => (
                      <li key={index} className="flex items-start">
                        <FiAward className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{award}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === 'trivia' && (
                <motion.div
                  key="trivia"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/50 rounded-xl p-6"
                >
                  <ul className="space-y-4">
                    {actor.trivia.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 font-bold mr-2">•</span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
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
                <div>
                  <h3 className="text-gray-400 text-sm">Ngày sinh</h3>
                  <p className="text-white">{formatDate(actor.birthDate)}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Nơi sinh</h3>
                  <p className="text-white">{actor.birthPlace}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Độ phổ biến</h3>
                  <div className="mt-1 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                      <div 
                        style={{ width: `${actor.popularity}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-500 to-purple-600"
                      ></div>
                    </div>
                    <span className="text-white text-sm mt-1">{actor.popularity}%</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Mạng xã hội</h3>
                  <div className="flex space-x-4 mt-2">
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={`https://instagram.com/${actor.socialMedia.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-red-500"
                    >
                      Instagram
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={`https://twitter.com/${actor.socialMedia.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-red-500"
                    >
                      Twitter
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={`https://facebook.com/${actor.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-red-500"
                    >
                      Facebook
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Related Actors */}
            <motion.div 
              variants={itemVariants}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">Diễn viên liên quan</h2>
              
              <div className="space-y-4">
                {actor.relatedActors.map((relatedActor) => (
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
            </motion.div>
          </div>
        </div>
        
        {/* More From This Actor */}
        <motion.div 
          variants={itemVariants}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6">Phim đáng chú ý</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {actor.filmography.slice(0, 6).map((film) => (
              <motion.div
                key={film.id}
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
                <Link href={`/movies/${film.id}`}>
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={film.posterPath}
                      alt={film.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-medium text-sm truncate">{film.title}</h3>
                      <div className="flex items-center mt-1">
                        <FiStar className="text-yellow-500 mr-1 h-3 w-3" />
                        <span className="text-xs text-gray-300">{film.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Newsletter */}
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