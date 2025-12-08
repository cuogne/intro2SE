import api from './api';

export interface Movie {
  _id: string;
  title: string;
  minutes: number;
  genre: string[];
  releaseDate: string;
  posterImg: string;
  trailerLink: string;
  description: string;
  status: string;
}

// DỮ LIỆU GIẢ (Backup)
const MOCK_MOVIES: Movie[] = Array.from({ length: 8 }).map((_, index) => ({
  _id: `mock-${index}`,
  title: `Phim Mẫu ${index + 1}`,
  minutes: 120,
  genre: ['Hành động', 'Viễn tưởng'],
  releaseDate: new Date().toISOString(),
  posterImg: 'https://placehold.co/300x450/png?text=Mock+Data',
  trailerLink: '',
  description: 'Dữ liệu giả lập.',
  status: index % 2 === 0 ? 'Now Showing' : 'Coming Soon',
}));

export const fetchMovies = async (status: 'Now Showing' | 'Coming Soon'): Promise<Movie[]> => {
  try {
    const endpoint = status === 'Now Showing' ? '/v1/movies/now_showing' : '/v1/movies/coming_soon';
    console.log(`📡 Đang gọi API: ${endpoint}`);
    
    const response = await api.get(endpoint);
    const resData = response.data;

    console.log("🔍 Cấu trúc trả về gốc:", resData);

    // TRƯỜNG HỢP 1: Backend trả về mảng trực tiếp [Movie, Movie]
    if (Array.isArray(resData)) {
        return resData.length ? resData : MOCK_MOVIES.filter(m => m.status === status);
    }

    // TRƯỜNG HỢP 2: Backend trả về object { data: [Movie, Movie] } (Chuẩn RESTful phổ biến)
    if (resData.data && Array.isArray(resData.data)) {
        return resData.data.length ? resData.data : MOCK_MOVIES.filter(m => m.status === status);
    }

    // TRƯỜNG HỢP 3: Backend trả về object phân trang { data: { docs: [...], total: 10 } } (Thường gặp với Mongoose Paginate)
    if (resData.data && typeof resData.data === 'object') {
        // Thử tìm các key chứa mảng phổ biến
        const innerData = resData.data;
        console.log("📦 Đang tìm mảng trong object:", Object.keys(innerData));

        if (Array.isArray(innerData.docs)) return innerData.docs;       // mongoose-paginate
        if (Array.isArray(innerData.movies)) return innerData.movies;   // tự định nghĩa
        if (Array.isArray(innerData.results)) return innerData.results; // cấu trúc khác
        if (Array.isArray(innerData.items)) return innerData.items;     // cấu trúc khác
    }

    console.warn("⚠️ Không tìm thấy mảng phim trong phản hồi API. Dùng Mock Data.");
    return MOCK_MOVIES.filter(m => m.status === status);

  } catch (error) {
    console.error("❌ Lỗi gọi API:", error);
    return MOCK_MOVIES.filter(m => m.status === status);
  }
};

export const fetchMovieDetail = async (id: string): Promise<Movie | null> => {
    try {
        const response = await api.get(`/v1/movies/${id}`);
        const data = response.data;
        // Logic tìm dữ liệu tương tự
        if (data.data) return data.data;
        return data;
    } catch (error) {
        return null;
    }
}