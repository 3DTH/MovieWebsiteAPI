import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";
import { Movie } from "@/app/api/movieApi";

interface MovieGridCardProps {
  movie: Movie;
  height?: number;
}

const MovieGridCard: React.FC<MovieGridCardProps> = ({
  movie,
  height = 400,
}) => {
  return (
    <div
      className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
      style={{ height: `${height}px` }}
    >
      <Link href={`/movies/${movie._id}`}>
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
            src={
              movie.posterPath
                ? movie.posterPath.startsWith("http")
                  ? movie.posterPath
                  : `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                : "/images/movie-placeholder.jpg"
            }
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white">{movie.title}</h3>

            <div className="mt-1 flex items-center text-sm text-gray-300">
              <FiStar className="mr-1 text-yellow-500" />
              <span>{movie.voteAverage.toFixed(1)}</span>
              <span className="mx-2">•</span>
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>

            <p className="mt-2 text-sm text-gray-300 line-clamp-3">
              {movie.overview}
            </p>

            <div className="mt-3 flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-gray-700 px-2 py-1 text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Optional badges */}
      {movie.voteAverage >= 8 && (
        <div className="absolute right-2 top-2 rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
          HOT
        </div>
      )}

      {new Date(movie.releaseDate) >=
        new Date(new Date().setMonth(new Date().getMonth() - 3)) && (
        <div className="absolute left-2 top-2 rounded bg-green-500 px-2 py-1 text-xs font-bold text-black">
          NEW
        </div>
      )}
    </div>
  );
};

export default MovieGridCard;
