import React, { useMemo, useState } from "react";
import "../index.css";
// Inlined type: Showtime and ShowtimeStatus
type ShowtimeStatus = "upcoming" | "running" | "done";

interface Showtime {
    id: string;
    code: string;
    title: string;
    duration: string;
    genre: string;
    startTime: string; // e.g. "19:30"
    endTime: string; // e.g. "22:31"
    date: string; // e.g. "2023-10-24"
    room: string;
    status: ShowtimeStatus;
}
import ShowtimeFormModal from "../components/ShowtimeFormModal";

const SAMPLE_SHOWTIMES: Showtime[] = [
    { id: "1", code: "S001", title: "Avengers: Endgame", duration: "3h 01m", genre: "Hành động", startTime: "19:30", endTime: "22:31", date: "2023-10-24", room: "Phòng IMAX", status: "upcoming" },
    { id: "2", code: "S002", title: "Barbie", duration: "1h 54m", genre: "Hài hước", startTime: "20:00", endTime: "21:54", date: "2023-10-24", room: "Phòng 02", status: "running" },
    { id: "3", code: "S003", title: "Oppenheimer", duration: "3h 00m", genre: "Lịch sử", startTime: "14:00", endTime: "17:00", date: "2023-10-24", room: "Phòng IMAX", status: "done" },
    { id: "4", code: "S004", title: "Spider-Man: No Way Home", duration: "2h 28m", genre: "Hành động", startTime: "15:00", endTime: "17:28", date: "2023-10-24", room: "Phòng 01", status: "upcoming" },
    { id: "5", code: "S005", title: "The Batman", duration: "2h 55m", genre: "Hành động", startTime: "18:00", endTime: "20:55", date: "2023-10-25", room: "Phòng IMAX", status: "upcoming" },
    { id: "6", code: "S006", title: "Toy Story 4", duration: "1h 40m", genre: "Hoạt hình", startTime: "10:00", endTime: "11:40", date: "2023-10-25", room: "Phòng 02", status: "done" },
    { id: "7", code: "S007", title: "Dune", duration: "2h 35m", genre: "Khoa học", startTime: "21:00", endTime: "23:35", date: "2023-10-25", room: "Phòng IMAX", status: "running" },
    { id: "8", code: "S008", title: "Top Gun: Maverick", duration: "2h 5m", genre: "Hành động", startTime: "17:00", endTime: "19:05", date: "2023-10-26", room: "Phòng 01", status: "upcoming" },
    { id: "9", code: "S009", title: "Joker", duration: "2h 2m", genre: "Chính kịch", startTime: "12:00", endTime: "14:02", date: "2023-10-26", room: "Phòng 02", status: "upcoming" },
    { id: "10", code: "S010", title: "Interstellar", duration: "2h 49m", genre: "Khoa học", startTime: "20:00", endTime: "22:49", date: "2023-10-26", room: "Phòng IMAX", status: "upcoming" },
    { id: "11", code: "S011", title: "The Matrix", duration: "2h 16m", genre: "Khoa học", startTime: "13:00", endTime: "15:16", date: "2023-10-27", room: "Phòng 01", status: "upcoming" },
    { id: "12", code: "S012", title: "Sonic The Hedgehog", duration: "1h 40m", genre: "Phiêu lưu", startTime: "11:00", endTime: "12:40", date: "2023-10-27", room: "Phòng 02", status: "done" },
    {
        id: "13",
        code: "S013",
        title: "Guardians of the Galaxy",
        duration: "2h 1m",
        genre: "Hành động",
        startTime: "19:00",
        endTime: "21:01",
        date: "2023-10-27",
        room: "Phòng IMAX",
        status: "running",
    },
    { id: "14", code: "S014", title: "Frozen II", duration: "1h 43m", genre: "Hoạt hình", startTime: "09:30", endTime: "11:13", date: "2023-10-28", room: "Phòng 02", status: "upcoming" },
    { id: "15", code: "S015", title: "Inception", duration: "2h 28m", genre: "Khoa học", startTime: "22:00", endTime: "00:28", date: "2023-10-28", room: "Phòng IMAX", status: "upcoming" },
];

const ShowtimeManagementPage: React.FC = () => {
    const [showtimes, setShowtimes] = useState<Showtime[]>(SAMPLE_SHOWTIMES);

    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterRoom, setFilterRoom] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 5; // fixed page size (no selector)

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Showtime | undefined>(undefined);

    function openAdd() {
        setEditing(undefined);
        setModalOpen(true);
    }
    function openEdit(s: Showtime) {
        setEditing(s);
        setModalOpen(true);
    }
    function closeModal() {
        setEditing(undefined);
        setModalOpen(false);
    }
    function handleSave(s: Showtime) {
        setShowtimes((prev) => {
            const exists = prev.find((p) => p.id === s.id);
            if (exists) {
                return prev.map((p) => (p.id === s.id ? s : p));
            }
            return [s, ...prev];
        });
        closeModal();
        setPage(1);
    }
    function handleDelete(id: string) {
        if (!confirm("Bạn có chắc muốn xóa suất chiếu này?")) return;
        setShowtimes((prev) => prev.filter((p) => p.id !== id));
    }

    const rooms = useMemo(() => Array.from(new Set(showtimes.map((s) => s.room))), [showtimes]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return showtimes.filter((s) => {
            if (q && !s.title.toLowerCase().includes(q)) return false;
            if (filterDate && s.date !== filterDate) return false;
            if (filterRoom && filterRoom !== "All" && s.room !== filterRoom) return false;
            return true;
        });
    }, [showtimes, search, filterDate, filterRoom]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // clamp page
    if (page > totalPages) {
        setPage(totalPages);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(total, startIndex + pageSize);

    const current = filtered.slice(startIndex, endIndex);

    function statusBadge(s: ShowtimeStatus) {
        switch (s) {
            case "upcoming":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Sắp chiếu
                    </span>
                );
            case "running":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                        <span className="size-1.5 rounded-full bg-blue-500"></span>
                        Đang chiếu
                    </span>
                );
            case "done":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20">
                        <span className="size-1.5 rounded-full bg-slate-500"></span>
                        Đã xong
                    </span>
                );
        }
    }

    function goToPage(n: number) {
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
                                value={filterRoom}
                                onChange={(e) => {
                                    setFilterRoom(e.target.value);
                                    setPage(1);
                                }}
                                className="form-select w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white pl-10 h-11 focus:border-primary focus:ring-primary text-sm cursor-pointer"
                            >
                                <option value="">Tất cả phòng</option>
                                {rooms.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark">
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider w-24">Mã suất</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Tên phim</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Thời gian</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Phòng chiếu</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Trạng thái</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                            {current.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors group">
                                    <td className="p-4 text-sm font-medium text-slate-500 dark:text-text-secondary">{s.code}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center overflow-hidden">
                                                <span className="material-symbols-outlined text-[20px]">movie</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{s.title}</span>
                                                <span className="text-xs text-slate-500 dark:text-text-secondary">
                                                    {s.duration} • {s.genre}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                {s.startTime} - {s.endTime}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-text-secondary">{new Date(s.date).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{s.room}</td>
                                    <td className="p-4">{statusBadge(s.status)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(s)}
                                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-border-dark text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {current.length === 0 && (
                                <tr>
                                    <td className="p-4 text-sm text-slate-500 dark:text-text-secondary" colSpan={6}>
                                        Không có kết quả
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318]">
                    <div className="text-sm text-slate-500 dark:text-text-secondary">
                        Hiển thị {startIndex + 1 <= total ? startIndex + 1 : 0} - {endIndex} của {total} suất chiếu
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-400 hover:bg-slate-50 dark:hover:bg-border-dark transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>

                        {/* Render page number buttons dynamically */}
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const n = i + 1;
                            return (
                                <button
                                    key={n}
                                    onClick={() => goToPage(n)}
                                    className={`flex size-9 items-center justify-center rounded-lg ${
                                        n === page
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-border-dark"
                                    } text-sm font-medium`}
                                >
                                    {n}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page === totalPages}
                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-400 hover:bg-slate-50 dark:hover:bg-border-dark transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
                {/* Modal */}
                <ShowtimeFormModal open={modalOpen} initial={editing} onClose={closeModal} onSave={handleSave} movieOptions={Array.from(new Set(showtimes.map((m) => m.title)))} roomOptions={rooms} />
            </div>
        </div>
    );
};

export default ShowtimeManagementPage;
