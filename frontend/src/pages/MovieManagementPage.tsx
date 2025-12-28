import { useState } from "react";
import "../index.css";
// Inlined type: Movie and MovieStatus
type MovieStatus = "now_showing" | "coming_soon" | "ended";

interface Movie {
    id: string;
    title: string;
    duration: number; // minutes
    genres: string[];
    releaseDate: string; // display string (dd/mm/yyyy)
    status: MovieStatus;
    poster: string;
    trailer?: string;
}
import MovieFormModal from "../components/MovieFormModal";

const SAMPLE_MOVIES: Movie[] = [
    {
        id: "MV001",
        title: "The Batman",
        duration: 176,
        genres: ["Hành động", "Tội phạm"],
        releaseDate: "04/03/2022",
        status: "now_showing",
        poster: "https://images.unsplash.com/photo-1612727794996-3b5b2ccf1f54?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6f1f8c3a9f0a09641f1f4f1b5a6d7c6d",
    },
    {
        id: "MV002",
        title: "Avatar: Dòng chảy của nước",
        duration: 192,
        genres: ["Viễn tưởng"],
        releaseDate: "16/12/2022",
        status: "coming_soon",
        poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8f06b4e10b2a5a8e1c2f8a3d7f6b4c6d",
    },
    {
        id: "MV003",
        title: "Oppenheimer",
        duration: 180,
        genres: ["Tiểu sử", "Chính kịch"],
        releaseDate: "21/07/2023",
        status: "coming_soon",
        poster: "https://images.unsplash.com/photo-1563201518-6f1c6a2a4b3f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b1a2c6f4e7d8b9f5a1b3c2d4e5f6a7b",
    },
    {
        id: "MV004",
        title: "John Wick: Chapter 4",
        duration: 169,
        genres: ["Hành động"],
        releaseDate: "24/03/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1558981403-c7f6f08d0c4b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
    },
    {
        id: "MV005",
        title: "Barbie",
        duration: 114,
        genres: ["Hài", "Kỳ ảo"],
        releaseDate: "21/07/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1542204165-5e5bfbfbed7b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    },
    {
        id: "MV005",
        title: "Barbie",
        duration: 114,
        genres: ["Hài", "Kỳ ảo"],
        releaseDate: "21/07/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1542204165-5e5bfbfbed7b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    },
    {
        id: "MV005",
        title: "Barbie",
        duration: 114,
        genres: ["Hài", "Kỳ ảo"],
        releaseDate: "21/07/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1542204165-5e5bfbfbed7b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    },
    {
        id: "MV005",
        title: "Barbie",
        duration: 114,
        genres: ["Hài", "Kỳ ảo"],
        releaseDate: "21/07/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1542204165-5e5bfbfbed7b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    },
    {
        id: "MV005",
        title: "Barbie",
        duration: 114,
        genres: ["Hài", "Kỳ ảo"],
        releaseDate: "21/07/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1542204165-5e5bfbfbed7b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    },
    {
        id: "MV005",
        title: "Barbie",
        duration: 114,
        genres: ["Hài", "Kỳ ảo"],
        releaseDate: "21/07/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1542204165-5e5bfbfbed7b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    },
    {
        id: "MV005",
        title: "Barbie",
        duration: 114,
        genres: ["Hài", "Kỳ ảo"],
        releaseDate: "21/07/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1542204165-5e5bfbfbed7b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    },
    {
        id: "MV005",
        title: "Barbie",
        duration: 114,
        genres: ["Hài", "Kỳ ảo"],
        releaseDate: "21/07/2023",
        status: "ended",
        poster: "https://images.unsplash.com/photo-1542204165-5e5bfbfbed7b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    },
];

export default function MovieManagementPage() {
    const [movies, setMovies] = useState<Movie[]>(SAMPLE_MOVIES);
    const [isAddOpen, setAddOpen] = useState(false); // show modal only when user clicks "Thêm phim mới"
    const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

    // Pagination state
    const [page, setPage] = useState<number>(1);
    const pageSize = 5;
    const total = movies.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(page * pageSize, total);
    const pageItems = movies.slice(startIndex, endIndex);

    const goToPage = (p: number) => {
        if (p < 1) p = 1;
        if (p > totalPages) p = totalPages;
        setPage(p);
    };

    const prevPage = () => goToPage(page - 1);
    const nextPage = () => goToPage(page + 1);

    const getPageRange = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const window = 2; // show current +/- window
        let start = Math.max(1, page - window);
        let end = Math.min(totalPages, page + window);
        if (page <= window) end = 1 + window * 2;
        if (page + window >= totalPages) start = totalPages - window * 2;
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    // helpers for add/edit/delete
    const getNextId = () => {
        const nums = movies.map((m) => parseInt(m.id.replace(/\D/g, ""), 10)).filter(Boolean);
        const max = nums.length ? Math.max(...nums) : 0;
        return `MV${String(max + 1).padStart(3, "0")}`;
    };

    const handleSaveMovie = (payload: Partial<Movie> & { id?: string }) => {
        // if id provided and exists -> edit; otherwise add
        if (payload.id) {
            setMovies((prev) => prev.map((p) => (p.id === payload.id ? { ...p, ...(payload as Movie) } : p)));
        } else {
            const id = getNextId();
            const newMovie: Movie = {
                id,
                title: payload.title || "(Untitled)",
                duration: payload.duration || 0,
                genres: payload.genres || [],
                releaseDate: payload.releaseDate || "",
                status: (payload.status as Movie["status"]) || "now_showing",
                poster: payload.poster || "",
            };
            setMovies((prev) => {
                const next = [...prev, newMovie];
                // go to last page where the new item sits
                const pgs = Math.max(1, Math.ceil(next.length / pageSize));
                setPage(pgs);
                return next;
            });
        }
        setAddOpen(false);
        setCurrentMovie(null);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa phim này?")) return;
        setMovies((prev) => prev.filter((p) => p.id !== id));
        // adjust page if necessary
        setTimeout(() => {
            const pgs = Math.max(1, Math.ceil((movies.length - 1) / pageSize));
            if (page > pgs) setPage(pgs);
        }, 0);
    };

    return (
        <div>
            <div>
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Danh sách Phim</h2>
                            <p className="text-slate-500 dark:text-text-secondary mt-1">Quản lý tất cả phim đang chiếu, sắp chiếu và đã kết thúc.</p>
                        </div>
                        <button
                            className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg text-sm shadow-primary/30 flex items-center gap-2 transition-all active:scale-95 group"
                            onClick={() => {
                                setCurrentMovie(null);
                                setAddOpen(true);
                            }}
                        >
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                            Thêm phim mới
                        </button>
                    </div>

                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="form-input w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary pl-10 h-11 focus:border-primary focus:ring-primary text-sm"
                                placeholder="Tìm kiếm theo tên phim, diễn viên..."
                                type="text"
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
                            <div className="relative min-w-[140px]">
                                <select className="w-full appearance-none rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white pl-4 pr-10 py-2.5 focus:outline-none focus:border-primary cursor-pointer text-sm">
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="now_showing">Đang chiếu</option>
                                    <option value="coming_soon">Sắp chiếu</option>
                                    <option value="ended">Đã kết thúc</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark text-slate-500 dark:text-text-secondary text-xs uppercase tracking-wider font-semibold">
                                        <th className="p-4 w-16 text-center">Poster</th>
                                        <th className="p-4 min-w-[200px]">Tiêu đề</th>
                                        <th className="p-4">Thời lượng</th>
                                        <th className="p-4">Thể loại</th>
                                        <th className="p-4">Ngày phát hành</th>
                                        <th className="p-4">Trạng thái</th>
                                        <th className="p-4 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                    {pageItems.map((m) => (
                                        <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="w-10 h-14 bg-cover bg-center rounded shadow-sm" style={{ backgroundImage: `url('${m.poster}')` }} />
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-slate-900 dark:text-white">{m.title}</div>
                                                <div className="text-xs text-slate-500 dark:text-text-secondary mt-0.5">ID: #{m.id}</div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{m.duration} phút</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {m.genres.map((g) => (
                                                        <span
                                                            key={g}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-border-dark text-slate-800 dark:text-slate-300"
                                                        >
                                                            {g}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{m.releaseDate}</td>
                                            <td className="p-4">
                                                {m.status === "now_showing" && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Hoạt động
                                                    </span>
                                                )}
                                                {m.status === "coming_soon" && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                        <span className="size-1.5 rounded-full bg-amber-500" />
                                                        Sắp chiếu
                                                    </span>
                                                )}
                                                {m.status === "ended" && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20">
                                                        <span className="size-1.5 rounded-full bg-slate-400" />
                                                        Đã kết thúc
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setCurrentMovie(m);
                                                            setAddOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-border-dark text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(m.id)}
                                                        className="p-1.5 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-400 dark:hover:text-red-400 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark/50">
                            <div className="text-xs text-slate-500 dark:text-text-secondary">
                                Hiển thị {total === 0 ? 0 : startIndex + 1}-{endIndex} của {total} phim
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={prevPage}
                                    aria-label="Previous page"
                                    disabled={page === 1}
                                    className={`size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 dark:hover:bg-border-dark hover:text-white ${
                                        page === 1 ? "opacity-50 pointer-events-none" : ""
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>

                                {getPageRange().map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        aria-current={p === page ? "page" : undefined}
                                        className={`size-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                                            p === page ? "bg-primary text-white" : "text-slate-400 hover:bg-white/10 dark:hover:bg-border-dark hover:text-white"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    onClick={nextPage}
                                    aria-label="Next page"
                                    disabled={page === totalPages}
                                    className={`size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 dark:hover:bg-border-dark hover:text-white ${
                                        page === totalPages ? "opacity-50 pointer-events-none" : ""
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MovieFormModal open={isAddOpen} initialMovie={currentMovie} onClose={() => setAddOpen(false)} onSave={handleSaveMovie} />
        </div>
    );
}
