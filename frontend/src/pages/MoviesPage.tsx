import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../services/movieService';
import type { Movie } from '../services/movieService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8; // Dựa trên hình vẽ (2 hàng x 4 cột)

const MoviesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Now Showing' | 'Coming Soon'>('Now Showing');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Load data khi đổi Tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMovies(activeTab);
      setMovies(data);
      setCurrentPage(1); // Reset về trang 1 khi đổi tab
      setLoading(false);
    };
    loadData();
  }, [activeTab]);

  // Logic phân trang
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const currentMovies = movies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab Switcher - Giống thiết kế */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('Now Showing')}
          className={`px-6 py-2 rounded font-bold border border-black transition-colors ${
            activeTab === 'Now Showing' 
              ? 'bg-black text-white' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Phim đang chiếu
        </button>
        <button
          onClick={() => setActiveTab('Coming Soon')}
          className={`px-6 py-2 rounded font-bold border border-black transition-colors ${
            activeTab === 'Coming Soon' 
              ? 'bg-black text-white' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Phim sắp chiếu
        </button>
      </div>

      {/* Grid Movies */}
      {loading ? (
        <div className="text-center py-20">Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mb-12">
            {currentMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="flex items-center px-4 py-2 border border-black rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </button>

              {/* Render số trang */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 border border-black rounded font-bold transition-colors ${
                        currentPage === pageNum 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="flex items-center px-4 py-2 border border-black rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage;