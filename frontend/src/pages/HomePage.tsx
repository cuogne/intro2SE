import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMovies } from '../services/movieService';
import type { Movie } from '../services/movieService';

const HomePage: React.FC = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [nowShowingMovies, setNowShowingMovies] = useState<Movie[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'now' | 'soon'>('now');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const [nowShowing, comingSoon] = await Promise.all([
          fetchMovies('Now Showing'),
          fetchMovies('Coming Soon')
        ]);
        
        setNowShowingMovies(nowShowing);
        setComingSoonMovies(comingSoon);
        
        // Set first movie as hero
        if (nowShowing.length > 0) {
          setHeroMovie(nowShowing[0]);
        }
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMovies();
  }, []);

  const handleBookTicket = (movieId?: string) => {
    if (movieId) {
      navigate(`/movie/${movieId}`);
    } else {
      navigate('/movies');
    }
  };

  const handleViewDetails = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  const handleWatchTrailer = (trailerLink?: string) => {
    if (trailerLink) {
      window.open(trailerLink, '_blank');
    }
  };

  const getRating = (movie: Movie): number => {
    // Mock rating - in real app, this would come from the API
    return 8.5;
  };

  const getAgeRating = (movie: Movie): string => {
    // Mock age rating - in real app, this would come from the API
    return 'P';
  };

  const displayMovies = activeTab === 'now' ? nowShowingMovies.slice(0, 5) : comingSoonMovies.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-900 dark:text-white text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center">
      {/* Hero Section */}
      {heroMovie && (
        <div className="w-full max-w-[1440px] px-4 md:px-10 py-6">
          <div className="flex min-h-[480px] md:min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl md:rounded-2xl items-start justify-end px-6 pb-12 md:px-12 md:pb-16 relative overflow-hidden group"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(16, 22, 34, 1) 0%, rgba(16, 22, 34, 0.6) 50%, rgba(16, 22, 34, 0.1) 100%), url(${heroMovie.posterImg || 'https://via.placeholder.com/1440x560'})`
            }}>
            <div className="z-10 flex flex-col gap-4 max-w-2xl animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded">{getAgeRating(heroMovie)}</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">IMAX 3D</span>
                <span className="text-gray-300 text-sm font-medium ml-2">
                  {heroMovie.genre.join(' • ')} • {heroMovie.minutes} phút
                </span>
              </div>
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-xl">
                {heroMovie.title}
              </h1>
              <p className="text-gray-200 text-base md:text-lg font-normal line-clamp-2 max-w-xl drop-shadow-md">
                {heroMovie.description || 'Một kiệt tác điện ảnh không thể bỏ lỡ.'}
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <button 
                  onClick={() => handleBookTicket(heroMovie._id)}
                  className="flex h-12 items-center justify-center rounded-lg px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/40 hover:bg-primary/90 hover:scale-105 transition-all duration-300 gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                  <span>Đặt vé ngay</span>
                </button>
                {heroMovie.trailerLink && (
                  <button 
                    onClick={() => handleWatchTrailer(heroMovie.trailerLink)}
                    className="flex h-12 items-center justify-center rounded-lg px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base font-bold hover:bg-white/20 transition-all gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">play_circle</span>
                    <span>Xem Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="w-full max-w-[1440px] px-4 md:px-10 mt-4">
        <div className="border-b border-gray-300 dark:border-[#232f48] flex gap-8 mb-8">
          <button 
            onClick={() => setActiveTab('now')}
            className="relative pb-4 px-2 cursor-pointer group"
          >
            <p className={`text-lg font-bold transition-colors ${
              activeTab === 'now' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-text-secondary'
            } group-hover:text-primary`}>
              Phim Đang Chiếu
            </p>
            {activeTab === 'now' && (
              <div className="absolute bottom-0 left-0 h-[3px] w-full bg-primary rounded-t-full"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('soon')}
            className="relative pb-4 px-2 cursor-pointer group"
          >
            <p className={`text-lg font-medium transition-colors ${
              activeTab === 'soon' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-text-secondary'
            } group-hover:text-gray-900 dark:group-hover:text-white`}>
              Phim Sắp Chiếu
            </p>
            {activeTab === 'soon' && (
              <div className="absolute bottom-0 left-0 h-[3px] w-full bg-primary rounded-t-full"></div>
            )}
            {activeTab !== 'soon' && (
              <div className="absolute bottom-0 left-0 h-[3px] w-full bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-[#232f48] rounded-t-full transition-colors"></div>
            )}
          </button>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="w-full max-w-[1440px] px-4 md:px-10 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {displayMovies.map((movie) => (
            <div key={movie._id} className="group flex flex-col gap-3">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-[#232f48]">
                <img 
                  alt={movie.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  src={movie.posterImg || 'https://via.placeholder.com/300x450'}
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4 z-10">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBookTicket(movie._id);
                    }}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                  >
                    Mua Vé
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewDetails(movie._id);
                    }}
                    className="w-full py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg border border-white/30 hover:bg-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                  >
                    Chi Tiết
                  </button>
                </div>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {getAgeRating(movie)}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1 items-center bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-yellow-400 text-[14px]">star</span>
                  <span className="text-white text-xs font-bold">{getRating(movie).toFixed(1)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white text-base font-bold leading-tight truncate group-hover:text-primary transition-colors">
                  {movie.title}
                </h3>
                <p className="text-gray-600 dark:text-text-secondary text-sm mt-1">
                  {movie.genre.join(' • ')} • {movie.minutes} phút
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link to="/movies">
            <button className="px-6 py-2 rounded-full border border-gray-300 dark:border-[#232f48] text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:border-gray-900 dark:hover:border-white transition-all text-sm font-bold flex items-center gap-2">
              Xem tất cả phim
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Promotions Section */}
      <div className="w-full bg-gray-100 dark:bg-[#161d2b] py-12 mt-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_activity</span>
              Khuyến Mãi & Ưu Đãi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Promo 1 */}
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-[#232f48] border border-gray-200 dark:border-[#324467] group cursor-pointer h-48">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%), url(https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800)'
                }}
              ></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start">
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded mb-2">HOT</span>
                <h3 className="text-white text-xl font-bold mb-1">Combo Bắp Nước</h3>
                <p className="text-gray-300 text-sm mb-4">Giảm 20% khi đặt online</p>
                <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Mua ngay <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
            {/* Promo 2 */}
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-[#232f48] border border-gray-200 dark:border-[#324467] group cursor-pointer h-48">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%), url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800)'
                }}
              ></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-2">MEMBER</span>
                <h3 className="text-white text-xl font-bold mb-1">Thứ 3 Vui Vẻ</h3>
                <p className="text-gray-300 text-sm mb-4">Vé chỉ từ 50k mọi suất chiếu</p>
                <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Xem chi tiết <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
            {/* Promo 3 */}
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-[#232f48] border border-gray-200 dark:border-[#324467] group cursor-pointer h-48 hidden lg:block">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%), url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800)'
                }}
              ></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start">
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-2">U22</span>
                <h3 className="text-white text-xl font-bold mb-1">Ưu Đãi Học Sinh</h3>
                <p className="text-gray-300 text-sm mb-4">Đồng giá 45k cả tuần</p>
                <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Đăng ký ngay <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
