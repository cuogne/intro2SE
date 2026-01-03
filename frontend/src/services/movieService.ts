import api from "./api";

export type MovieStatus = "now_showing" | "coming_soon" | "ended";

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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MovieListResponse {
  movies: Movie[];
  pagination: Pagination;
}


export const fetchMovies = async (
  status?: "Now Showing" | "Coming Soon" | "Ended",
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<MovieListResponse> => {
  try {
    const params: Record<string, any> = { page, limit };
    if (search) {
      params.search = search;
    }
    let normalizedStatus: MovieStatus | undefined;
    if (status) {
      normalizedStatus =
        status === "Now Showing"
          ? "now_showing"
          : status === "Coming Soon"
          ? "coming_soon"
          : "ended";
      params.status = normalizedStatus;
    }

    const response = await api.get("/v1/movies", { params });
    const resData = response.data;

    // Expected shape: { success: true, data: { movies: Movie[], pagination: { page, limit, total, totalPages } } }
    const movies: Movie[] = resData?.data?.movies ?? resData?.movies ?? [];
    const pagination =
      resData?.data?.pagination ??
      resData?.pagination ??
      ({
        page,
        limit,
        total: movies.length,
        totalPages: Math.max(1, Math.ceil((movies.length || 0) / limit)),
      } as Pagination);

    const finalMovies = movies.length
      ? movies
      : [];

    return { movies: finalMovies, pagination };
  } catch (error) {
    console.error("❌ Lỗi gọi API:", error);
    return {
      movies: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 1,
      },
    };
  }
};

export const createMovie = async (
  movieData: Partial<Movie>
): Promise<Movie | null> => {
  try {
    const response = await api.post("/v1/movies", movieData);
    return response.data?.data ?? response.data ?? null;
  } catch (error) {
    console.error("❌ Lỗi tạo phim:", error);
    return null;
  }
};

export const updateMovie = async (
  id: string,
  movieData: Partial<Movie>
): Promise<Movie | null> => {
  try {
    const response = await api.put(`/v1/movies/${id}`, movieData);
    return response.data?.data ?? response.data ?? null;
  } catch (error) {
    console.error("❌ Lỗi cập nhật phim:", error);
    return null;
  }
};

export const deleteMovie = async (id: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/v1/movies/${id}`);
    return response.data?.success ?? false;
  } catch (error) {
    console.error("❌ Lỗi xóa phim:", error);
    return false;
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
};
