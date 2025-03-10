"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiClock, FiPlay } from 'react-icons/fi';
import { Movie } from '@/app/api/movieApi';

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

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105">
      <Link href={`/movies/${movie.tmdbId}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="text-lg font-semibold text-white line-clamp-2">{movie.title}</h3>
            <div className="mt-1 flex items-center text-sm text-gray-300">
              <FiStar className="mr-1 text-yellow-500" />
              <span>{movie.voteAverage.toFixed(1)}</span>
              <span className="mx-2">•</span>
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <Link href={`/movies/${movie.tmdbId}`}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-red-600/80 p-3 opacity-0 transition-opacity duration-300 hover:bg-red-600 group-hover:opacity-100">
          <FiPlay className="h-6 w-6 text-white" />
        </div>
      </Link>
      
      {/* Optional badges */}
      {movie.voteAverage >= 8 && (
        <div className="absolute right-2 top-2 rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
          HOT
        </div>
      )}
      
      {new Date(movie.releaseDate) >= new Date(new Date().setMonth(new Date().getMonth() - 3)) && (
        <div className="absolute left-2 top-2 rounded bg-green-500 px-2 py-1 text-xs font-bold text-black">
          NEW
        </div>
      )}
    </div>
  );
};

export default MovieCard;