import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiPlay, FiCalendar, FiInfo } from 'react-icons/fi';
import { Movie } from '@/app/api/movieApi';

interface MovieListItemProps {
  movie: Movie;
}

const MovieListItem: React.FC<MovieListItemProps> = ({ movie }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:bg-gray-700">
      <Link href={`/movies/${movie._id}`} className="flex h-full">
        <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden sm:h-40 sm:w-28">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100px, 112px"
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-red-400">{movie.title}</h3>
            <p className="mt-1 text-sm text-gray-300 line-clamp-2">{movie.overview}</p>
          </div>
          
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
            <div className="flex items-center">
              <FiStar className="mr-1 text-yellow-500" />
              <span>{movie.voteAverage.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map(genre => (
                <span key={genre.id} className="rounded-full bg-gray-700 px-2 py-1 text-xs">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center px-4">
          <div className="rounded-full bg-red-600 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <FiPlay className="h-5 w-5 text-white" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieListItem;