import { useEffect, useMemo, useState } from "react";
import "../index.css";
import CinemaEditor from "../components/CinemaEditor";
import { fetchCinemas, createCinema, updateCinema, deleteCinema } from "../services/cinemaService";
import type { Cinema } from "../services/cinemaService";
import { message, Input, Select, ConfigProvider, theme } from "antd";
import { useTheme } from "../context/ThemeContext";

// Helpers to map backend values to Vietnamese labels
const mapType = (type?: string) => {
    if (!type) return "Không xác định";
    const t = type.toLowerCase();
    if (t.includes("imax")) return "IMAX";
    if (t.includes("3d")) return "3D VIP";
    if (t.includes("2d")) return "2D Standard";
    return type;
};

const mapStatus = (status?: string) => {
    if (!status) return "Không xác định";
    const s = status.toLowerCase();
    if (s === "open") return "Hoạt động";
    if (s === "closed") return "Đã đóng";
    if (s === "renovating") return "Đang nâng cấp";
    return status;
};

export default function AdminCinemaPage() {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorInitial, setEditorInitial] = useState<Cinema | null>(null);
    const { isDarkTheme } = useTheme();

    useEffect(() => {
        // Load cinemas from backend service
        const load = async () => {
            try {
                const data = await fetchCinemas();
                setCinemas(data);
            } catch (error: any) {
                console.error(error);
                message.error("Lỗi khi tải rạp");
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return cinemas.filter((r) => {
            if (statusFilter !== "all") {
                if (statusFilter === "open" && r.status !== "open") return false;
                if (statusFilter === "renovating" && r.status !== "renovating") return false;
                if (statusFilter === "closed" && r.status !== "closed") return false;
            }
            if (!q) return true;
            return r.name.toLowerCase().includes(q) || (r._id || "").toLowerCase().includes(q);
        });
    }, [cinemas, query, statusFilter]);

    const total = filtered.length;
    const pageItems = filtered;

    // Actions
    const handleAdd = () => {
        // Open editor for creating a new cinema
        setEditorInitial(null);
        setEditorOpen(true);
    };

    const handleEdit = (_id: string) => {
        const cinema = cinemas.find((c) => c._id === _id);
        if (!cinema) {
            alert("Rạp không tìm thấy");
            return;
        }
        // Load cinema into editor for editing
        setEditorInitial(cinema);
        setEditorOpen(true);
    };

    const handleDelete = async (_id: string) => {
        const c = cinemas.find((x) => x._id === _id);
        if (!c) return; // no-op
        const confirmed = window.confirm(`Xác nhận xóa rạp "${c.name}"? Hành động này không thể hoàn tác.`);
        if (!confirmed) return;
        const hide = message.loading(`Đang xóa rạp "${c.name}"...`, 0);
        try {
            const ok = await deleteCinema(_id);
            hide();
            if (ok) {
                message.success("Xóa rạp thành công");
                const data = await fetchCinemas();
                setCinemas(data);
            } else {
                message.error("Không thể xóa rạp");
            }
        } catch (e: any) {
            hide();
            console.error(e);
            message.error("Lỗi khi xóa rạp");
        }
    };

    // Refresh button and handler removed — list is refreshed after create/update/delete operations.

    async function handleSaveRoom(payload: Partial<Cinema>) {
        const hide = message.loading(payload._id ? "Đang cập nhật rạp..." : "Đang tạo rạp...", 0);
        try {
            if (payload._id) {
                const res = await updateCinema(payload._id, payload);
                hide();
                if (res) {
                    message.success("Cập nhật rạp thành công");
                } else {
                    message.error("Cập nhật thất bại");
                }
            } else {
                const res = await createCinema(payload);
                hide();
                if (res) {
                    message.success("Tạo rạp thành công");
                } else {
                    message.error("Tạo rạp thất bại");
                }
            }
            const data = await fetchCinemas();
            setCinemas(data);
            setEditorOpen(false);
            setEditorInitial(null);
        } catch (e: any) {
            hide();
            console.error(e);
            message.error("Lỗi khi lưu rạp");
        }
    }

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý rạp phim</h1>
                    <p className="text-slate-500 dark:text-text-secondary text-sm">Danh sách các rạp và trạng thái hiện tại</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 group bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-primary/25 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                    <span>Thêm rạp mới</span>
                </button>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-4 shadow-sm">
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
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex flex-col w-full md:flex-1">
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Tìm kiếm rạp</span>
                            <Input
                                placeholder="Nhập tên rạp hoặc mã..."
                                prefix={<span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ height: "44px" }}
                            />
                        </div>

                        <div className="flex flex-col w-full md:w-64">
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Trạng thái</span>
                            <Select
                                value={statusFilter}
                                onChange={(value) => setStatusFilter(value)}
                                style={{ height: "44px" }}
                                options={[
                                    { value: "all", label: "Tất cả trạng thái" },
                                    { value: "open", label: "Hoạt động" },
                                    { value: "renovating", label: "Đang nâng cấp" },
                                    { value: "closed", label: "Đã đóng" },
                                ]}
                            />
                        </div>
                    </div>
                </ConfigProvider>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark">
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Tên phòng</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Sức chứa</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Loại</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Trạng thái</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                            {pageItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-sm text-slate-600 dark:text-slate-300">
                                        Không có rạp nào
                                    </td>
                                </tr>
                            ) : (
                                pageItems.map((r) => (
                                    <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {String(r.type || "")
                                                            .toLowerCase()
                                                            .includes("imax")
                                                            ? "star"
                                                            : String(r.type || "")
                                                                  .toLowerCase()
                                                                  .includes("3d")
                                                            ? "3d_rotation"
                                                            : "theaters"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="font-medium text-slate-900 dark:text-white">{r.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-text-secondary mt-0.5">ID: #{r._id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                                            {r.capacity ?? (Array.isArray(r.seatLayout) ? r.seatLayout.reduce((acc, row) => acc + (row.seats?.length || 0), 0) : 0)} ghế
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-border-dark text-slate-800 dark:text-slate-300">
                                                {mapType(r.type)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {r.status === "open" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                    <span className="size-2 rounded-full bg-emerald-500" />
                                                    {mapStatus(r.status)}
                                                </span>
                                            )}
                                            {r.status === "renovating" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                    <span className="size-2 rounded-full bg-amber-500" />
                                                    {mapStatus(r.status)}
                                                </span>
                                            )}
                                            {r.status === "closed" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                                                    <span className="size-2 rounded-full bg-red-500" />
                                                    {mapStatus(r.status)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(r._id)}
                                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-border-dark text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(r._id)}
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
                    <div className="text-sm text-slate-500 dark:text-text-secondary">Hiển thị {total} rạp</div>
                </div>
            </div>
            <CinemaEditor open={editorOpen} initial={editorInitial} onClose={() => setEditorOpen(false)} onSave={handleSaveRoom} />
        </div>
    );
}
