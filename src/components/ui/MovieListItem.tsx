"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiClock, FiPlay, FiCalendar, FiFlag } from 'react-icons/fi';

interface MovieProps {
  movie: {
    id: string;
    title: string;
    poster: string;
    year: number;
    rating: string;
    duration: string;
    type: string;
    isNew: boolean;
    genres: string[];
    country: string;
  };
}

const MovieListItem: React.FC<MovieProps> = ({ movie }) => {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group flex bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300">
        <div className="relative w-[120px] h-[180px] flex-shrink-0">
          <Image 
            src={movie.poster} 
            alt={movie.title}
            fill
            className="object-cover"
            sizes="120px"
          />
          
          {movie.isNew && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              MỚI
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors">
              {movie.title}
            </h3>
            
            <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
              <FiStar className="text-yellow-500 mr-1" />
              <span className="text-white">{movie.rating}</span>
            </div>
          </div>
          
          <div className="mt-2 flex items-center text-sm text-gray-400 flex-wrap gap-y-1">
            <div className="flex items-center mr-4">
              <FiCalendar className="mr-1" />
              <span>{movie.year}</span>
            </div>
            
            <div className="flex items-center mr-4">
              <FiClock className="mr-1" />
              <span>{movie.duration}</span>
            </div>
            
            <div className="flex items-center">
              <FiFlag className="mr-1" />
              <span>{movie.country}</span>
            </div>
            
            <div className="flex items-center ml-auto">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                movie.type === 'series' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}
              </span>
            </div>
          </div>
          
          <p className="mt-3 text-gray-400 text-sm line-clamp-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis ultricies.
          </p>
          
          <div className="mt-auto pt-3 flex items-center">
            <button className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
              <FiPlay className="mr-2" />
              <span>Xem phim</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieListItem;