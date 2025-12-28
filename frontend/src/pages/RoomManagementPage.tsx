import { useMemo, useState } from "react";
import "../index.css";
import RoomEditor from "../components/RoomEditor";
import type { RoomPayload } from "../components/RoomEditor";

export type RoomStatus = "active" | "maintenance" | "closed";

export interface CinemaRoom {
    id: string;
    name: string;
    capacity: number;
    type: string;
    status: RoomStatus;
    seatLayout?: { row: string; seats: string[] }[];
}

const RAW_ROOMS: Array<{ id: string; name: string; capacity: number; type: string; status: RoomStatus }> = [
    { id: "P01", name: "Phòng 01", capacity: 120, type: "2D Standard", status: "active" },
    { id: "P02", name: "Phòng 02", capacity: 80, type: "3D VIP", status: "active" },
    { id: "P03", name: "Phòng IMAX", capacity: 300, type: "IMAX", status: "maintenance" },
    { id: "P04", name: "Phòng 04", capacity: 100, type: "2D Standard", status: "active" },
    { id: "P05", name: "Phòng 05", capacity: 120, type: "2D Standard", status: "closed" },
];

const INITIAL_ROWS = 11;

const INITIAL_ROOMS: CinemaRoom[] = RAW_ROOMS.map((r) => {
    const cols = Math.min(20, Math.max(0, Math.ceil(r.capacity / INITIAL_ROWS) || 0));
    const seatLayout = Array.from({ length: INITIAL_ROWS }).map((_, i) => ({
        row: String.fromCharCode("A".charCodeAt(0) + i),
        seats: Array.from({ length: cols }).map((_, j) => `${String.fromCharCode("A".charCodeAt(0) + i)}${String(j + 1).padStart(2, "0")}`),
    }));
    return { ...r, seatLayout };
});

export default function RoomManagementPage() {
    const [rooms, setRooms] = useState<CinemaRoom[]>(INITIAL_ROOMS);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorInitial, setEditorInitial] = useState<RoomPayload | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rooms.filter((r) => {
            if (statusFilter !== "all") {
                if (statusFilter === "active" && r.status !== "active") return false;
                if (statusFilter === "maintenance" && r.status !== "maintenance") return false;
                if (statusFilter === "closed" && r.status !== "closed") return false;
            }
            if (!q) return true;
            return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
        });
    }, [rooms, query, statusFilter]);

    const total = filtered.length;
    const pageItems = filtered;

    // Actions
    const handleAdd = () => {
        setEditorInitial(null);
        setEditorOpen(true);
    };

    const handleEdit = (id: string) => {
        const room = rooms.find((r) => r.id === id);
        if (!room) return;
        // build a reasonable initial seat layout from capacity (11 rows default)
        const rows = 11;
        const cols = Math.min(20, Math.max(0, Math.ceil(room.capacity / rows) || 0));
        const seatLayout = Array.from({ length: rows }).map((_, i) => ({
            row: String.fromCharCode("A".charCodeAt(0) + i),
            seats: Array.from({ length: cols }).map((_, j) => `${String.fromCharCode("A".charCodeAt(0) + i)}${String(j + 1).padStart(2, "0")}`),
        }));
        setEditorInitial({ id: room.id, name: room.name, address: "", status: room.status, type: room.type, seatLayout });
        setEditorOpen(true);
    };

    const handleDelete = (id: string) => {
        const room = rooms.find((r) => r.id === id);
        if (!room) return;
        const confirmed = window.confirm(`Xác nhận xóa phòng "${room.name}" (ID: ${room.id})?
Hành động này không thể hoàn tác.`);
        if (!confirmed) return;
        setRooms((prev) => prev.filter((r) => r.id !== id));
    };
    const handleRefresh = () => console.log("Refresh (placeholder)");

    function handleSaveRoom(payload: RoomPayload) {
        const capacity = payload.seatLayout.reduce((acc: number, row: { seats: string[] }) => acc + row.seats.length, 0);
        if (payload.id) {
            // update existing
            setRooms((prev) =>
                prev.map((r) =>
                    r.id === payload.id
                        ? { ...r, name: payload.name || r.name, capacity, status: (payload.status as RoomStatus) || r.status, type: payload.type || r.type, seatLayout: payload.seatLayout }
                        : r
                )
            );
        } else {
            const nextId = ((): string => {
                const nums = rooms.map((r) => parseInt(r.id.replace(/\D/g, ""), 10)).filter(Boolean);
                const max = nums.length ? Math.max(...nums) : 0;
                return `P${String(max + 1).padStart(2, "0")}`;
            })();
            const newRoom: CinemaRoom = {
                id: nextId,
                name: payload.name || `Phòng ${nextId}`,
                capacity,
                type: payload.type || "Custom",
                status: (payload.status as RoomStatus) || "active",
                seatLayout: payload.seatLayout,
            };
            setRooms((prev) => [...prev, newRoom]);
        }

        setEditorOpen(false);
        setEditorInitial(null);
    }

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý phòng chiếu</h1>
                    <p className="text-slate-500 dark:text-text-secondary text-sm">Danh sách và trạng thái các phòng chiếu phim hiện tại</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 group bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-primary/25 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                    <span>Thêm phòng mới</span>
                </button>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-4 shadow-sm">
                <div className="flex flex-col md:flex-row items-end gap-4">
                    <label className="flex flex-col w-full md:flex-1">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Tìm kiếm phòng</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-secondary text-[20px]">search</span>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="form-input w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary pl-10 h-11 focus:border-primary focus:ring-primary text-sm"
                                placeholder="Nhập tên phòng hoặc mã số..."
                                aria-label="Tìm kiếm phòng"
                            />
                        </div>
                    </label>

                    <label className="flex flex-col w-full md:w-64">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Trạng thái</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-secondary text-[20px]">filter_list</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="form-select w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white pl-10 h-11 focus:border-primary focus:ring-primary text-sm cursor-pointer"
                                aria-label="Trạng thái"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="maintenance">Bảo trì</option>
                                <option value="closed">Đã đóng</option>
                            </select>
                        </div>
                    </label>

                    <button
                        onClick={handleRefresh}
                        className="hidden md:flex items-center justify-center size-11 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-[#111318] hover:bg-slate-50 dark:hover:bg-border-dark text-slate-600 dark:text-slate-400 transition-colors"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark">
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider w-24">ID</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Tên phòng</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Sức chứa</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Loại phòng</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Trạng thái</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                            {pageItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-sm text-slate-600 dark:text-slate-300">
                                        Không có phòng nào
                                    </td>
                                </tr>
                            ) : (
                                pageItems.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors group">
                                        <td className="p-4 text-sm font-medium text-slate-500 dark:text-text-secondary">{r.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {r.type.toLowerCase().includes("imax") ? "star" : r.type.toLowerCase().includes("3d") ? "3d_rotation" : "theaters"}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{r.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{r.capacity} ghế</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-border-dark text-slate-800 dark:text-slate-300">
                                                {r.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {r.status === "active" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                                    Hoạt động
                                                </span>
                                            )}
                                            {r.status === "maintenance" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                    <span className="size-1.5 rounded-full bg-amber-500" />
                                                    Bảo trì
                                                </span>
                                            )}
                                            {r.status === "closed" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                                                    <span className="size-1.5 rounded-full bg-red-500" />
                                                    Đã đóng
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(r.id)}
                                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-border-dark text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(r.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318]">
                    <div className="text-sm text-slate-500 dark:text-text-secondary">Hiển thị {total} phòng</div>
                </div>
            </div>
            <RoomEditor open={editorOpen} initial={editorInitial} onClose={() => setEditorOpen(false)} onSave={handleSaveRoom} />
        </div>
    );
}
