import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../services/movieService';
import type { Movie } from '../services/movieService';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'Now Showing' | 'Coming Soon'>('Now Showing');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 1. Thêm State cho từ khóa tìm kiếm - lấy từ URL nếu có
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Load data khi đổi Tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMovies(activeTab);
      setMovies(data);
      setCurrentPage(1);
      // Reset tìm kiếm khi đổi tab (tuỳ chọn)
      setSearchTerm(''); 
      setLoading(false);
    };
    loadData();
  }, [activeTab]);

  // 2. Logic Lọc phim (Search Logic)
  // Lọc phim trước, sau đó mới Phân trang
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Logic Phân trang (Dựa trên danh sách đã lọc)
  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const currentMovies = filteredMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset về trang 1 nếu người dùng nhập tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
    // Update URL khi search term thay đổi
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* --- KHU VỰC HEADER CỦA TRANG (Tab + Tìm kiếm) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        
        {/* Tab Switcher */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('Now Showing')}
            className={`px-6 py-2 rounded font-bold border transition-colors ${
              activeTab === 'Now Showing' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-[#232f48] text-white border-[#232f48] hover:bg-[#324467]'
            }`}
          >
            Phim đang chiếu
          </button>
          <button
            onClick={() => setActiveTab('Coming Soon')}
            className={`px-6 py-2 rounded font-bold border transition-colors ${
              activeTab === 'Coming Soon' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-[#232f48] text-white border-[#232f48] hover:bg-[#324467]'
            }`}
          >
            Phim sắp chiếu
          </button>
        </div>

        {/* Ô Tìm Kiếm Mới */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Tìm kiếm phim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#232f48] border border-[#324467] text-white rounded px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-secondary"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary" />
        </div>
      </div>

      {/* Grid Movies */}
      {loading ? (
        <div className="text-center py-20 text-white">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Thông báo nếu không tìm thấy phim */}
          {filteredMovies.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              Không tìm thấy phim nào phù hợp với từ khóa "{searchTerm}".
            </div>
          )}

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
                className="flex items-center px-4 py-2 bg-[#232f48] border border-[#324467] text-white rounded disabled:opacity-50 hover:bg-[#324467] cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 border rounded font-bold transition-colors ${
                        currentPage === pageNum 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-[#232f48] text-white border-[#324467] hover:bg-[#324467]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="flex items-center px-4 py-2 bg-[#232f48] border border-[#324467] text-white rounded disabled:opacity-50 hover:bg-[#324467] cursor-pointer transition-colors"
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