"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiPlay } from 'react-icons/fi';

interface MovieGridCardProps {
  movie: {
    id: string;
    title: string;
    poster: string;
    year: number;
    rating: string;
    type: string;
    isNew: boolean;
  };
  height?: number;
}

const MovieGridCard: React.FC<MovieGridCardProps> = ({ movie, height = 400 }) => {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div 
        className="group relative rounded-lg overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0">
          <Image 
            src={movie.poster} 
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg group-hover:text-red-500 transition-colors">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-yellow-500">
                <FiStar className="mr-1" />
                <span>{movie.rating}</span>
              </div>
              
              <span className="text-gray-300">{movie.year}</span>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="rounded-full bg-red-600 p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <FiPlay className="text-white text-2xl" />
          </div>
        </div>
        
        {movie.isNew && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            MỚI
          </div>
        )}
        
        {movie.type === 'series' && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            PHIM BỘ
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieGridCard;