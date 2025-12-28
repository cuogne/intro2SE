// Inlined type: TicketType
interface TicketType {
    id: string;
    name: string;
    price: number;
    description?: string;
    active: boolean;
}
import { useEffect, useState } from "react";

type Props = {
    open: boolean;
    initial?: TicketType | null;
    onClose: () => void;
    onSave: (payload: Partial<TicketType> & { id?: string }) => void;
};

export default function TicketTypeFormModal({ open, initial = null, onClose, onSave }: Props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [active, setActive] = useState(true);

    useEffect(() => {
        if (initial) {
            setName(initial.name || "");
            setPrice(initial.price ?? "");
            setDescription(initial.description || "");
            setActive(Boolean(initial.active));
        } else {
            setName("");
            setPrice("");
            setDescription("");
            setActive(true);
        }
    }, [initial, open]);

    if (!open) return null;

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!name.trim()) return alert("Tên loại vé không được để trống");
        const p = typeof price === "number" ? price : Number(price || 0);
        if (isNaN(p) || p < 0) return alert("Giá phải là số hợp lệ");
        onSave({ id: initial?.id, name: name.trim(), price: p, description: description.trim(), active });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{initial ? "Chỉnh sửa loại vé" : "Thêm loại vé"}</h3>
                    <button className="text-slate-400 hover:text-red-600 rounded-lg p-1 hover:bg-red-100 transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 dark:text-text-secondary uppercase tracking-wider">Tên loại vé</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-4 py-2.5"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Giá</label>
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                type="number"
                                className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-4 py-2.5"
                            />
                        </div>
                        <div className="space-y-1.5 flex flex-col justify-between">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</label>
                            <div className="mb-2">
                                <label className="border border-slate-200 rounded-lg dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-4 py-2.5">
                                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded" />
                                    <span className="w-full form-input rounded-lg ml-2">Hoạt động</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mô tả</label>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-4 py-2.5"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-slate-600 hover:bg-gray-100">
                            Hủy
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-blue-800">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
