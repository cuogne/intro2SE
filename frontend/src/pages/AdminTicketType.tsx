import { useState } from "react";
// Inlined type: TicketType
interface TicketType {
    id: string;
    name: string;
    price: number;
    description?: string;
    active: boolean;
}
import TicketTypeFormModal from "../components/TicketTypeFormModal";

const INITIAL_TYPES: TicketType[] = [
    { id: "T01", name: "Vé thường", price: 70000, description: "Ghế thường", active: true },
    { id: "T02", name: "Vé VIP", price: 120000, description: "Ghế VIP có khoảng để chân rộng", active: true },
    { id: "T03", name: "Vé trẻ em", price: 40000, description: "Dành cho trẻ em dưới 12 tuổi", active: true },
    { id: "T04", name: "Vé sinh viên", price: 50000, description: "Tặng kèm khi xuất trình thẻ SV", active: false },
];

export default function AdminTicketType() {
    const [types, setTypes] = useState<TicketType[]>(INITIAL_TYPES);
    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState<TicketType | null>(null);

    const getNextId = () => {
        const nums = types.map((t) => parseInt(t.id.replace(/\D/g, ""), 10)).filter(Boolean);
        const max = nums.length ? Math.max(...nums) : 0;
        return `T${String(max + 1).padStart(2, "0")}`;
    };

    const handleAdd = () => {
        setCurrent(null);
        setIsOpen(true);
    };

    const handleEdit = (id: string) => {
        const found = types.find((t) => t.id === id) || null;
        setCurrent(found);
        setIsOpen(true);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa loại vé này?")) return;
        setTypes((prev) => prev.filter((t) => t.id !== id));
    };

    const handleSave = (payload: Partial<TicketType> & { id?: string }) => {
        if (payload.id) {
            setTypes((prev) => prev.map((t) => (t.id === payload.id ? { ...t, ...(payload as TicketType) } : t)));
        } else {
            const id = getNextId();
            setTypes((prev) => [...prev, { id, name: payload.name || "Vé mới", price: payload.price || 0, description: payload.description || "", active: payload.active ?? true }]);
        }
        setIsOpen(false);
        setCurrent(null);
    };

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý loại vé</h1>
                    <p className="text-slate-500 dark:text-text-secondary text-sm">Thêm, chỉnh sửa và quản lý các loại vé hiện có</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-primary group hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-primary/25 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                    <span>Thêm loại vé</span>
                </button>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark">
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider w-24">ID</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Tên loại vé</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Giá</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Mô tả</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Trạng thái</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                            {types.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-sm text-slate-600 dark:text-slate-300">
                                        Không có loại vé nào
                                    </td>
                                </tr>
                            ) : (
                                types.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors group">
                                        <td className="p-4 text-sm font-medium text-slate-500 dark:text-text-secondary">{t.id}</td>
                                        <td className="p-4">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{t.name}</span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{t.price.toLocaleString("vi-VN")} đ</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{t.description || "-"}</td>
                                        <td className="p-4">
                                            {t.active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                                    Hoạt động
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                                                    <span className="size-1.5 rounded-full bg-red-500" />
                                                    Ngưng
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(t.id)}
                                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-border-dark text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
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
                    <div className="text-sm text-slate-500 dark:text-text-secondary">Hiển thị {types.length} loại vé</div>
                </div>
            </div>
            <TicketTypeFormModal open={isOpen} initial={current || undefined} onClose={() => setIsOpen(false)} onSave={handleSave} />
        </div>
    );
}
