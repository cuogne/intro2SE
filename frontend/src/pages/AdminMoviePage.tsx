import { useEffect, useState } from "react";
import "../index.css";
import { notification, Spin } from "antd";
import MovieFormModal from "../components/MovieFormModal";
import type { Movie } from "../services/movieService";
import { fetchMovies, createMovie, updateMovie, deleteMovie } from "../services/movieService";

// Movies are loaded from the API via `movieService.fetchMovies`

export default function AdminMoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isAddOpen, setAddOpen] = useState(false); // show modal only when user clicks "Thêm phim mới"
    const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    // Pagination state
    const [page, setPage] = useState<number>(1);
    const pageSize = 5;
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const startIndex = (page - 1) * pageSize;
    const pageItems = movies; // API returns page-level items

    // Filters / search
    const [statusFilter, setStatusFilter] = useState<"" | "Now Showing" | "Coming Soon" | "Ended">("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        loadMovies(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, statusFilter]);

    async function loadMovies(p = page) {
        setIsLoading(true);
        try {
            const res = await fetchMovies(statusFilter || undefined, p, pageSize);
            setMovies(res.movies.map(apiToUI));
            setTotal(res.pagination.total);
            setTotalPages(res.pagination.totalPages);
            setPage(res.pagination.page);
        } catch (err) {
            console.error("Failed to load movies:", err);
        } finally {
            setIsLoading(false);
        }
    }

    const apiToUI = (m: any): Movie => ({
        _id: m._id || m.id || "",
        title: m.title || "",
        minutes: m.minutes || m.duration || 0,
        genre: m.genre || m.genres || [],
        releaseDate: (() => {
            const d = m.releaseDate || m.release_date || "";
            if (!d) return "";
            if (d.includes("-")) {
                return d.slice(0, 10); // yyyy-mm-dd
            }
            // if already in dd/mm/yyyy -> convert to yyyy-mm-dd
            if (d.includes("/")) {
                const [da, mo, y] = d.split("/");
                return `${y}-${mo.padStart(2, "0")}-${da.padStart(2, "0")}`;
            }
            return d;
        })(),
        status:
            m.status === "now_showing" || m.status === "coming_soon" || m.status === "ended"
                ? m.status
                : m.status
                ? String(m.status).toLowerCase().includes("now")
                    ? "now_showing"
                    : String(m.status).toLowerCase().includes("soon")
                    ? "coming_soon"
                    : "ended"
                : "ended",
        posterImg: m.posterImg || m.poster || "",
        trailerLink: m.trailerLink || m.trailer || undefined,
        description: m.description || "",
    });

    const uiToApi = (p: Partial<Movie>) => {
        const convRelease = p.releaseDate || "";
        let releaseIso = convRelease;
        // convert dd/mm/yyyy -> yyyy-mm-dd if needed
        if (convRelease.includes("/")) {
            const [d, m, y] = convRelease.split("/");
            releaseIso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
        return {
            title: p.title,
            minutes: p.minutes ?? p.minutes,
            genre: p.genre ?? p.genre,
            releaseDate: releaseIso,
            posterImg: p.posterImg ?? p.posterImg,
            trailerLink: p.trailerLink ?? p.trailerLink,
            status: p.status,
            description: p.description ?? p.description,
        } as any;
    };
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

    const displayDate = (iso?: string) => {
        if (!iso) return "";
        if (iso.includes("-")) {
            const [y, mo, da] = iso.slice(0, 10).split("-");
            return `${da.padStart(2, "0")}/${mo.padStart(2, "0")}/${y}`;
        }
        return iso;
    };

    // helper removed; backend assigns IDs

    const handleSaveMovie = async (payload: Partial<Movie> & { _id?: string }) => {
        let success = false;
        setIsSaving(true);
        try {
            if (payload._id) {
                const res = await updateMovie(payload._id, uiToApi(payload));
                if (!res) {
                    notification.error({ message: "Cập nhật phim thất bại" });
                    return;
                }
                // refresh current page
                await loadMovies(page);
                notification.success({ message: "Cập nhật phim thành công" });
                success = true;
            } else {
                const res = await createMovie(uiToApi(payload));
                if (!res) {
                    notification.error({ message: "Tạo phim thất bại" });
                    return;
                }
                // after creating, reload first page (or stay on current page)
                // move to the page that contains newest item could be last page; for simplicity reload current page
                await loadMovies(1);
                setPage(1);
                notification.success({ message: "Tạo phim thành công" });
                success = true;
            }
        } catch (err) {
            console.error(err);
            notification.error({ message: "Lỗi khi lưu phim" });
        } finally {
            setIsSaving(false);
            if (success) {
                setAddOpen(false);
                setCurrentMovie(null);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa phim này?")) return;
        setDeletingId(id);
        try {
            const ok = await deleteMovie(id);
            if (!ok) {
                notification.error({ message: "Xóa thất bại" });
                return;
            }
            // if current page becomes empty, go to previous page
            const remainingOnPage = movies.length - 1;
            if (remainingOnPage <= 0 && page > 1) {
                setPage(page - 1);
                await loadMovies(page - 1);
            } else {
                await loadMovies(page);
            }
            notification.success({ message: "Xóa phim thành công" });
        } catch (err) {
            console.error(err);
            notification.error({ message: "Lỗi khi xóa phim" });
        } finally {
            setDeletingId(null);
        }
    };

    const filteredItems = pageItems.filter((m) => !searchText.trim() || m.title.toLowerCase().includes(searchText.toLowerCase()));

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
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="form-input w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary pl-10 h-11 focus:border-primary focus:ring-primary text-sm"
                                placeholder="Tìm kiếm theo phim..."
                                type="text"
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
                            <div className="relative min-w-[140px]">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as any)}
                                    className="w-full appearance-none rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white pl-4 pr-10 py-2.5 focus:outline-none focus:border-primary cursor-pointer text-sm"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="Now Showing">Đang chiếu</option>
                                    <option value="Coming Soon">Sắp chiếu</option>
                                    <option value="Ended">Đã đóng</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <Spin spinning={isLoading} tip="Đang tải...">
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
                                        {filteredItems.map((m) => (
                                            <tr key={m._id} className="hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors group">
                                                <td className="p-4">
                                                    <div className="w-10 h-14 bg-cover bg-center rounded shadow-sm" style={{ backgroundImage: `url('${m.posterImg}')` }} />
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-900 dark:text-white">{m.title}</div>
                                                    <div className="text-xs text-slate-500 dark:text-text-secondary mt-0.5">ID: #{m._id}</div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{m.minutes} phút</td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {m.genre.map((g) => (
                                                            <span
                                                                key={g}
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-border-dark text-slate-800 dark:text-slate-300"
                                                            >
                                                                {g}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{displayDate(m.releaseDate)}</td>
                                                <td className="p-4">
                                                    {m.status === "now_showing" && (
                                                        <span className="truncate inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                                            Hoạt động
                                                        </span>
                                                    )}
                                                    {m.status === "coming_soon" && (
                                                        <span className="truncate inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                            <span className="size-2 rounded-full bg-amber-500" />
                                                            Sắp chiếu
                                                        </span>
                                                    )}
                                                    {m.status === "ended" && (
                                                        <span className="truncate inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20">
                                                            <span className="size-2 rounded-full bg-slate-400" />
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
                                                            onClick={() => handleDelete(m._id)}
                                                            disabled={deletingId === m._id}
                                                            className={`p-1.5 rounded-lg ${
                                                                deletingId === m._id ? "opacity-60 pointer-events-none" : "hover:bg-red-500/10 dark:hover:bg-red-900/20"
                                                            } text-slate-400 hover:text-red-400 dark:hover:text-red-400 transition-colors`}
                                                            title="Xóa"
                                                        >
                                                            {deletingId === m._id ? (
                                                                <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
                                                            ) : (
                                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Spin>
                        </div>

                        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark/50">
                            <div className="text-xs text-slate-500 dark:text-text-secondary">
                                Hiển thị {total === 0 ? 0 : startIndex + 1}-{total === 0 ? 0 : startIndex + filteredItems.length} của {total} phim
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

            <MovieFormModal open={isAddOpen} initialMovie={currentMovie} onClose={() => setAddOpen(false)} onSave={handleSaveMovie} saving={isSaving} />
        </div>
    );
}
