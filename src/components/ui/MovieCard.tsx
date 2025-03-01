"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiClock, FiPlay } from 'react-icons/fi';

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
  };
}

const MovieCard: React.FC<MovieProps> = ({ movie }) => {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="aspect-[2/3] relative overflow-hidden">
          <Image 
            src={movie.poster} 
            alt={movie.title}
            fill
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzEyMTIxMiIvPjwvc3ZnPg=="
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="rounded-full bg-red-600/80 p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <FiPlay className="text-white text-xl" />
            </div>
          </div>
          
          {movie.isNew && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              MỚI
            </div>
          )}
          
          {movie.type === 'series' && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              PHIM BỘ
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="text-white font-medium truncate group-hover:text-red-500 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center text-yellow-500">
              <FiStar className="mr-1" />
              <span>{movie.rating}</span>
            </div>
            
            <div className="flex items-center text-gray-400">
              <span>{movie.year}</span>
              <span className="mx-1">•</span>
              <FiClock className="mr-1" />
              <span>{movie.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;