import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination, ConfigProvider, theme } from "antd";
import MovieCard from "../components/MovieCard";
import { fetchMovies } from "../services/movieService";
import type { Movie, MovieListResponse } from "../services/movieService";
import { useTheme } from "../context/ThemeContext";

const ITEMS_PER_PAGE = 8;

const MoviesPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<"Now Showing" | "Coming Soon">("Now Showing");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        pageSize: ITEMS_PER_PAGE,
        current: 1,
    });

    const { isDarkTheme } = useTheme();

    // Lấy search term từ URL
    const searchTerm = searchParams.get("search") || "";

    // Load data khi đổi Tab, page, hoặc search term
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res: MovieListResponse = await fetchMovies(activeTab, currentPage, ITEMS_PER_PAGE, searchTerm || undefined);
                setMovies(res.movies);
                setPagination({
                    total: res.pagination.total,
                    pageSize: res.pagination.limit,
                    current: res.pagination.page,
                });
            } catch (error) {
                console.error("Error loading movies:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [activeTab, currentPage, searchTerm]);

    // Reset về trang 1 khi đổi tab hoặc search term thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleTabChange = (tab: "Now Showing" | "Coming Soon") => {
        setActiveTab(tab);
        // Xóa search param khi đổi tab (optional)
        searchParams.delete("search");
        setSearchParams(searchParams);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Tab Switcher */}
            <div className="flex justify-start gap-4 mb-8">
                <button
                    onClick={() => handleTabChange("Now Showing")}
                    className={`px-6 py-2 rounded font-bold border transition-colors ${
                        activeTab === "Now Showing"
                            ? "bg-slate-900 dark:bg-primary text-white border-slate-900 dark:border-primary"
                            : "bg-white dark:bg-surface-dark text-slate-900 dark:text-white border-slate-300 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-border-dark/50"
                    }`}
                >
                    Phim đang chiếu
                </button>
                <button
                    onClick={() => handleTabChange("Coming Soon")}
                    className={`px-6 py-2 rounded font-bold border transition-colors ${
                        activeTab === "Coming Soon"
                            ? "bg-slate-900 dark:bg-primary text-white border-slate-900 dark:border-primary"
                            : "bg-white dark:bg-surface-dark text-slate-900 dark:text-white border-slate-300 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-border-dark/50"
                    }`}
                >
                    Phim sắp chiếu
                </button>
            </div>

            {/* Search Result Info */}
            {searchTerm && (
                <div className="mb-6 text-center">
                    <p className="text-slate-600 dark:text-text-secondary">
                        Kết quả tìm kiếm cho: <span className="font-bold text-slate-900 dark:text-white">"{searchTerm}"</span>
                    </p>
                    <button
                        onClick={() => {
                            searchParams.delete("search");
                            setSearchParams(searchParams);
                        }}
                        className="text-primary hover:underline text-sm mt-2"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* Grid Movies */}
            {loading ? (
                <div className="text-center py-20 text-slate-600 dark:text-text-secondary">Đang tải dữ liệu...</div>
            ) : (
                <>
                    {movies.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 dark:text-text-secondary">
                            {searchTerm ? `Không tìm thấy phim nào phù hợp với từ khóa "${searchTerm}".` : "Không có phim nào."}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mb-12">
                                {movies.map((movie) => (
                                    <MovieCard key={movie._id} movie={movie} />
                                ))}
                            </div>

                            {/* Ant Design Pagination */}

                            {pagination.total > ITEMS_PER_PAGE && (
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorBgContainer: isDarkTheme() ? "#111318" : "#f8fafc",
                                            colorText: isDarkTheme() ? "#fff" : "#000",
                                            colorBorder: isDarkTheme() ? "#2d3748" : "#e2e8f0",
                                        },
                                        algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                                    }}
                                >
                                    <div className="flex justify-center mt-8">
                                        <Pagination
                                            current={pagination.current}
                                            total={pagination.total}
                                            pageSize={pagination.pageSize}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} phim`}
                                            className="dark:text-white"
                                        />
                                    </div>
                                </ConfigProvider>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default MoviesPage;
