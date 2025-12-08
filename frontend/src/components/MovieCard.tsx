import React from 'react';
import type { Movie } from '../services/movieService';
import { Clock } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="flex flex-col gap-2 group cursor-pointer">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        {movie.posterImg ? (
          <img 
            src={movie.posterImg} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        
        {/* Hover Overlay (Tùy chọn thêm để đẹp hơn) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Movie Info */}
      <div className="space-y-1">
        <h3 className="font-bold text-lg truncate" title={movie.title}>{movie.title}</h3>
        <div className="flex items-center text-sm text-gray-600 gap-2">
            <span>{movie.genre.join(', ')}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 gap-1">
            <Clock className="w-4 h-4" />
            <span>{movie.minutes} phút</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;