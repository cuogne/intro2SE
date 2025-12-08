// Định nghĩa kiểu dữ liệu khớp với movie.model.js của backend
export interface Movie {
  _id: string; // Mongoose tự tạo field này
  title: string;
  minutes: number;
  genre: string[];
  releaseDate: string; // API thường trả về ISO string
  posterImg: string;
  trailerLink: string;
  description: string;
  status: 'Now Showing' | 'Coming Soon'; // Dựa trên logic trang web
}

// Mock Data (Dữ liệu giả để test giao diện)
const MOCK_MOVIES: Movie[] = Array.from({ length: 20 }).map((_, index) => ({
  _id: `movie-${index}`,
  title: `Tên Phim ${index + 1}`,
  minutes: 120,
  genre: ['Hành động', 'Viễn tưởng'],
  releaseDate: '2025-12-20T00:00:00.000Z',
  posterImg: 'https://placehold.co/300x450/png?text=Poster', // Placeholder image
  trailerLink: 'https://youtube.com',
  description: 'Mô tả ngắn về phim...',
  status: index % 2 === 0 ? 'Now Showing' : 'Coming Soon',
}));

// Hàm lấy danh sách phim (giả lập gọi API)
export const fetchMovies = async (status: 'Now Showing' | 'Coming Soon'): Promise<Movie[]> => {
  // Giả lập độ trễ mạng
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MOVIES.filter(m => m.status === status));
    }, 500);
  });
};