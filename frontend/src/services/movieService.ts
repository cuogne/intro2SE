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

// DỮ LIỆU GIẢ (Backup)
const MOCK_MOVIES: Movie[] = Array.from({ length: 20 }).map((_, index) => ({
    _id: `mock-${index}`,
    title: `Phim Mẫu ${index + 1}`,
    minutes: 120,
    genre: ["Hành động", "Viễn tưởng"],
    releaseDate: new Date().toISOString(),
    posterImg: "https://placehold.co/300x450/png?text=Mock+Data",
    trailerLink: "",
    description: "Dữ liệu giả lập.",
    status: index % 2 === 0 ? "now_showing" : "coming_soon",
}));

export const fetchMovies = async (status?: "Now Showing" | "Coming Soon" | "Ended", page: number = 1, limit: number = 10): Promise<MovieListResponse> => {
    try {
        const params: Record<string, any> = { page, limit };
        let normalizedStatus: MovieStatus | undefined;
        if (status) {
            normalizedStatus = status === "Now Showing" ? "now_showing" : status === "Coming Soon" ? "coming_soon" : "ended";
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

        const finalMovies = movies.length ? movies : MOCK_MOVIES.filter((m) => !normalizedStatus || m.status === normalizedStatus);

        return { movies: finalMovies, pagination };
    } catch (error) {
        console.error("❌ Lỗi gọi API:", error);
        let normalizedStatus: MovieStatus | undefined = status === "Now Showing" ? "now_showing" : "coming_soon";
        const fallback = MOCK_MOVIES.filter((m) => !normalizedStatus || m.status === normalizedStatus);
        return {
            movies: fallback,
            pagination: { page, limit, total: fallback.length, totalPages: Math.max(1, Math.ceil(fallback.length / limit)) },
        };
    }
};

export const createMovie = async (movieData: Partial<Movie>): Promise<Movie | null> => {
    try {
        const response = await api.post("/v1/movies", movieData);
        return response.data?.data ?? response.data ?? null;
    } catch (error) {
        console.error("❌ Lỗi tạo phim:", error);
        return null;
    }
};

export const updateMovie = async (id: string, movieData: Partial<Movie>): Promise<Movie | null> => {
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
