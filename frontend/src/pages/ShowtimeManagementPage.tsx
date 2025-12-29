import React, { useEffect, useMemo, useState } from "react";
import "../index.css";
import { Pagination as AntPagination, ConfigProvider, theme, notification, Spin } from "antd";
import { fetchShowtimes, createShowtime, updateShowtime, deleteShowtime, type ShowtimeListItem, type Pagination as PagingInfo } from "../services/showtimeService";
import { fetchCinemas, type Cinema } from "../services/cinemaService";
import ShowtimeFormModal from "../components/ShowtimeFormModal";
import { useTheme } from "../context/ThemeContext";

type ShowtimeStatus = "upcoming" | "running" | "done";

const ShowtimeManagementPage: React.FC = () => {
    const { isDarkTheme } = useTheme();
    const [showtimes, setShowtimes] = useState<ShowtimeListItem[]>([]);

    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterCinemaId, setFilterCinemaId] = useState("");
    const [cinemas, setCinemas] = useState<Cinema[]>([]);

    const PAGE_SIZE = 10;
    const [paginationInfo, setPaginationInfo] = useState<PagingInfo | null>(null);

    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const load = async () => {
        setIsLoading(true);
        try {
            const filters: any = {};
            if (filterDate) filters.date = filterDate;
            if (filterCinemaId) filters.cinemaId = filterCinemaId;

            const { docs, pagination } = await fetchShowtimes(page, PAGE_SIZE, filters);
            setShowtimes(docs);
            setPaginationInfo(pagination ?? null);
        } catch (e) {
            console.error("Lỗi tải danh sách suất chiếu:", e);
            setShowtimes([]);
            setPaginationInfo(null);
            notification.error({ message: "Lỗi tải danh sách suất chiếu" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Load list from service per page (10 items per page)
        load();
    }, [page, filterDate, filterCinemaId]);

    // Fetch cinemas for the room selector
    useEffect(() => {
        const loadCinemas = async () => {
            try {
                const data = await fetchCinemas();
                setCinemas(data || []);
            } catch (e) {
                console.error("Lỗi tải danh sách rạp:", e);
                setCinemas([]);
            }
        };
        loadCinemas();
    }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ShowtimeListItem | undefined>(undefined);

    function computeStatus(startISO: string, endISO: string | undefined, minutes?: number): ShowtimeStatus {
        const now = new Date();
        const start = new Date(startISO);
        let end: Date;
        if (endISO && !isNaN(Date.parse(endISO))) end = new Date(endISO);
        else {
            end = new Date(start);
            const roundedHours = minutes ? Math.ceil(minutes / 60) : 1;
            end.setHours(end.getHours() + roundedHours);
        }
        if (now < start) return "upcoming";
        if (now >= start && now < end) return "running";
        return "done";
    }

    function openAdd() {
        setEditing(undefined);
        setModalOpen(true);
    }
    function openEdit(s: ShowtimeListItem) {
        setEditing(s);
        setModalOpen(true);
    }
    function closeModal() {
        setEditing(undefined);
        setModalOpen(false);
    }
    // s comes from the modal (different shape). Map to ShowtimeListItem before saving locally
    async function handleSave(s: any) {
        setIsSaving(true);
        try {
            // s: { id?, movieId, cinemaId, startTime: ISO, endTime: ISO, price }
            if (s.id) {
                const updated = await updateShowtime(s.id, {
                    movie: s.movieId,
                    cinema: s.cinemaId,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    price: s.price,
                });
                if (updated) {
                    load();
                    notification.success({ message: "Cập nhật suất chiếu thành công" });
                } else {
                    notification.error({ message: "Cập nhật suất chiếu thất bại" });
                }
            } else {
                const created = await createShowtime({ movieId: s.movieId, cinemaId: s.cinemaId, startTime: s.startTime, endTime: s.endTime, price: s.price });
                if (created) {
                    load();
                    notification.success({ message: "Tạo suất chiếu thành công" });
                } else {
                    notification.error({ message: "Tạo suất chiếu thất bại" });
                }
            }
        } catch (error) {
            console.error("Lỗi khi lưu suất chiếu:", error);
            notification.error({ message: "Lỗi khi lưu suất chiếu" });
        } finally {
            setIsSaving(false);
            closeModal();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bạn có chắc muốn xóa suất chiếu này?")) return;
        setDeletingId(id);
        try {
            const success = await deleteShowtime(id);
            if (success) {
                load();
                notification.success({ message: "Xóa suất chiếu thành công" });
            } else {
                notification.error({ message: "Xóa suất chiếu thất bại" });
            }
        } catch (e) {
            console.error("Lỗi khi xóa suất chiếu:", e);
            notification.error({ message: "Xóa suất chiếu thất bại" });
        } finally {
            setDeletingId(null);
        }
    }

    // Refresh statuses periodically (every minute) to keep 'running' state accurate
    useEffect(() => {
        const t = setInterval(() => {
            // Force re-render so computed statuses update
            setShowtimes((prev) => [...prev]);
        }, 60 * 1000);
        return () => clearInterval(t);
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return showtimes.filter((s) => {
            if (q && !(s.movie?.title ?? "").toLowerCase().includes(q)) return false;
            const sDate = new Date(s.startTime).toISOString().slice(0, 10);
            if (filterDate && sDate !== filterDate) return false;
            if (filterCinemaId && s.cinema?._id !== filterCinemaId) return false;
            return true;
        });
    }, [showtimes, search, filterDate, filterCinemaId]);

    // With server-side pagination we only have current page items in `showtimes`.
    const totalDocs = paginationInfo?.totalDocs ?? filtered.length;
    const currentStart = (page - 1) * PAGE_SIZE + 1;
    const currentEnd = currentStart + filtered.length - 1;

    const current = filtered; // contains items for current page (already fetched)

    function statusBadge(s: ShowtimeStatus) {
        switch (s) {
            case "upcoming":
                return (
                    <span className="inline-flex items-center truncate gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Sắp chiếu
                    </span>
                );
            case "running":
                return (
                    <span className="inline-flex items-center truncate gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                        <span className="size-1.5 rounded-full bg-blue-500"></span>
                        Đang chiếu
                    </span>
                );
            case "done":
            default:
                return (
                    <span className="inline-flex items-center truncate gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20">
                        <span className="size-1.5 rounded-full bg-slate-500"></span>
                        Đã xong
                    </span>
                );
        }
    }

    function formatISOToVN(isoString: string | undefined): string {
        if (!isoString) return "";
        const date = new Date(isoString);

        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = String(date.getFullYear());
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");

        return `${hh}:${min} - ${dd}/${mm}/${yyyy}`;
    }

    function minuteToDurationStr(minutes: number | undefined): string {
        return minutes ? `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m` : "";
    }

    function goToPage(n: number) {
        const totalPages = paginationInfo ? paginationInfo.totalPages : 1;
        if (n < 1) n = 1;
        if (n > totalPages) n = totalPages;
        setPage(n);
    }

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý suất chiếu</h1>
                    <p className="text-slate-500 dark:text-text-secondary text-sm">Danh sách các suất chiếu phim trong tuần</p>
                </div>
                <button
                    onClick={() => openAdd()}
                    className="flex items-center gap-2 group bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-primary/25 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                    Thêm suất chiếu
                </button>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-4 shadow-sm">
                <div className="flex flex-col md:flex-row items-end gap-4">
                    <label className="flex flex-col w-full md:flex-1">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Tìm kiếm phim</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-secondary text-[20px]">search</span>
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="form-input w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary pl-10 h-11 focus:border-primary focus:ring-primary text-sm"
                                placeholder="Nhập tên phim..."
                            />
                        </div>
                    </label>

                    <label className="flex flex-col w-full md:w-48">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Ngày chiếu</span>
                        <input
                            value={filterDate}
                            onChange={(e) => {
                                setFilterDate(e.target.value);
                                setPage(1);
                            }}
                            className="form-input w-full p-4 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 focus:border-primary focus:ring-primary text-sm"
                            type="date"
                        />
                    </label>

                    <label className="flex flex-col w-full md:w-48">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Phòng chiếu</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-secondary text-[20px]">theaters</span>
                            <select
                                value={filterCinemaId}
                                onChange={(e) => {
                                    setFilterCinemaId(e.target.value);
                                    setPage(1);
                                }}
                                className="form-select w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white pl-10 h-11 focus:border-primary focus:ring-primary text-sm cursor-pointer"
                            >
                                <option value="">Tất cả phòng</option>
                                {cinemas.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Spin spinning={isLoading} tip="Đang tải...">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark">
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Tên phim</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Giá vé</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Thời gian</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Phòng chiếu</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {current.map((s) => (
                                    <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-sky-600 dark:text-indigo-400 flex items-center justify-center overflow-hidden">
                                                    {s.movie?.posterImg ? (
                                                        <img src={s.movie?.posterImg} alt={s.movie?.title} className="w-10 h-14 object-cover rounded" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-[20px]">movie</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-120">{s.movie?.title}</span>
                                                    <span className="text-xs text-slate-500 dark:text-text-secondary">{minuteToDurationStr(s.movie?.minutes)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-900 dark:text-white font-medium">{s.price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm truncate text-slate-900 dark:text-white font-medium">{formatISOToVN(s.startTime)}</span>
                                                <span className="text-sm truncate text-slate-900 dark:text-white font-medium">{formatISOToVN(s.endTime)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{s.cinema?.name}</td>
                                        <td className="p-4">{statusBadge(computeStatus(s.startTime, s.endTime, s.movie?.minutes))}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(s)}
                                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-border-dark text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(s._id)}
                                                    disabled={deletingId === s._id}
                                                    className={`p-2 rounded-lg ${
                                                        deletingId === s._id ? "opacity-60 pointer-events-none" : "hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    } text-slate-400 hover:text-red-500 transition-colors`}
                                                >
                                                    {deletingId === s._id ? (
                                                        <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {current.length === 0 && (
                                    <tr>
                                        <td className="p-4 text-sm text-slate-500 dark:text-text-secondary" colSpan={5}>
                                            Không có kết quả
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Spin>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318]">
                    <div className="text-sm text-slate-500 dark:text-text-secondary">
                        Hiển thị {currentStart <= totalDocs ? currentStart : 0} - {currentEnd <= totalDocs ? currentEnd : 0} của {totalDocs} suất chiếu
                    </div>

                    <div className="flex items-center gap-2">
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorBgContainer: isDarkTheme() ? "#212f4d" : "#dddfe1",
                                    colorText: isDarkTheme() ? "#fff" : "#000",
                                },
                                algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                            }}
                        >
                            <AntPagination current={page} pageSize={PAGE_SIZE} total={paginationInfo?.totalDocs ?? 0} onChange={goToPage} showSizeChanger={false} />
                        </ConfigProvider>
                    </div>
                </div>
                {/* Modal */}
                <ShowtimeFormModal
                    open={modalOpen}
                    initial={
                        editing
                            ? ({
                                  id: editing._id,
                                  movieId: editing.movie?._id ?? "",
                                  cinemaId: editing.cinema?._id ?? "",
                                  date: new Date(editing.startTime).toISOString().slice(0, 10),
                                  startTime: (() => {
                                      const d = new Date(editing.startTime);
                                      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                                  })(),
                                  endTime: (() => {
                                      const d = new Date(editing.endTime ?? editing.startTime);
                                      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                                  })(),
                                  price: editing.price ?? 0,
                              } as any)
                            : undefined
                    }
                    onClose={closeModal}
                    onSave={handleSave}
                    movieOptions={Array.from(new Map(showtimes.map((m) => [m.movie?._id ?? m.movie, { id: m.movie?._id ?? "", title: m.movie?.title ?? "" }])).values()).filter((x) => x.id)}
                    roomOptions={cinemas}
                    saving={isSaving}
                />
            </div>
        </div>
    );
};

export default ShowtimeManagementPage;
