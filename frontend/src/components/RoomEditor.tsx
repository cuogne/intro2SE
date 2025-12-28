import { useState, useEffect } from "react";

// seats have boolean availability: true = available, false = unavailable
type SeatState = boolean;

interface RowLayout {
    row: string;
    seats: string[];
}

export interface RoomPayload {
    id?: string;
    name: string;
    address?: string;
    status?: "active" | "maintenance" | "closed";
    type?: string;
    seatLayout: RowLayout[]; // matches mongoose model: row + seats[]
}

type Props = {
    open: boolean;
    initial?: RoomPayload | null;
    onClose: () => void;
    onSave: (payload: RoomPayload) => void;
};

const DEFAULT_ROWS = 11;

function padCol(n: number, width = 2) {
    return String(n).padStart(width, "0");
}

export default function RoomEditor({ open, initial = null, onClose, onSave }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [address, setAddress] = useState(initial?.address ?? "");
    const [cols, setCols] = useState<number>(initial?.seatLayout?.[0]?.seats.length ?? 12);
    const [seatStates, setSeatStates] = useState<Record<string, SeatState>>({});
    const [rowsCount, setRowsCount] = useState<number>(initial?.seatLayout?.length ?? DEFAULT_ROWS);
    const [status, setStatus] = useState<"active" | "maintenance" | "closed">(initial?.status ?? "active");
    const [type, setType] = useState<string>(initial?.type ?? "Custom");

    // keep fields in sync when opening with an `initial` payload
    useEffect(() => {
        setName(initial?.name ?? "");
        setAddress(initial?.address ?? "");
        setCols(initial?.seatLayout?.[0]?.seats.length ?? 12);
        setRowsCount(initial?.seatLayout?.length ?? DEFAULT_ROWS);
        setStatus(initial?.status ?? "active");
        setType(initial?.type ?? "Custom");
        // reset seat state when loading a new initial payload
        setSeatStates({});
    }, [initial, open]);

    const clampedCols = Math.min(20, Math.max(0, cols));
    const clampedRows = Math.min(20, Math.max(0, rowsCount));

    const ROWS = Array.from({ length: clampedRows }).map((_, i) => String.fromCharCode("A".charCodeAt(0) + i));


    function toggleState(seatId: string) {
        setSeatStates((prev) => {
            const cur = prev[seatId];
            const next = !(cur === undefined ? true : cur);
            return { ...prev, [seatId]: next };
        });
    }

    function handleSave() {
        const rows: RowLayout[] = ROWS.map((r) => ({
            row: r,
            seats: Array.from({ length: clampedCols }).map((_, i) => `${r}${padCol(i + 1)}`),
        }));

        onSave({ id: initial?.id, name: name || "", address: address || "", status, type, seatLayout: rows });
        onClose();
    }

    // compute seat counts for current grid
    const totalSeats = clampedRows * clampedCols;
    let availableSeats = 0;
    let unavailableSeats = 0;

    if (clampedRows > 0 && clampedCols > 0) {
        for (const r of ROWS) {
            for (let i = 0; i < clampedCols; i++) {
                const id = `${r}${padCol(i + 1)}`;
                const state = seatStates[id];
                if (state === false) unavailableSeats++;
                else availableSeats++;
            }
        }
    }

    const nameMissing = !name.trim();
    const addressMissing = !address.trim();
    const noSeats = totalSeats === 0;
    const isSaveDisabled = nameMissing || addressMissing || noSeats;
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-2 overflow-y-auto">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-5xl max-h-[97vh] overflow-auto bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 pt-3 shadow-lg">
                <div className="p-2 flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tạo phòng chiếu mới</h3>
                    <button className="text-slate-400 hover:text-red-500 rounded-lg p-1 hover:bg-red-500/10 transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="">
                        <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Tên phòng</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary px-4 py-2.5 focus:border-primary focus:ring-primary"
                            placeholder="Phòng IMAX"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Địa chỉ</label>
                        <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary px-4 py-2.5 focus:border-primary focus:ring-primary"
                            placeholder="Địa chỉ rạp"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Loại phòng</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full form-select rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-3 py-2"
                        >
                            <option value="2D Standard">2D Standard</option>
                            <option value="3D VIP">3D VIP</option>
                            <option value="IMAX">IMAX</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4 grid gap-4 items-end grid-cols-[auto_auto_auto_1fr]">
                    <div className="max-w-30 flex flex-col">
                        <label className="text-sm text-slate-700 dark:text-slate-300 mb-1">Số hàng</label>
                        <input
                            type="number"
                            min={0}
                            max={20}
                            value={rowsCount}
                            onChange={(e) => setRowsCount(Number(e.target.value))}
                            className="form-input w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-3 py-2 focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <div className="max-w-30 flex flex-col">
                        <label className="text-sm text-slate-700 dark:text-slate-300 mb-1">Số cột</label>
                        <input
                            type="number"
                            min={0}
                            max={20}
                            value={cols}
                            onChange={(e) => setCols(Number(e.target.value))}
                            className="form-input w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-3 py-2 focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <div className="max-w-50 flex flex-col">
                        <label className="text-sm text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="form-select w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-3 py-2 focus:border-primary focus:ring-primary"
                        >
                            <option value="active">Hoạt động</option>
                            <option value="maintenance">Bảo trì</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                    </div>

                    <div className="col-span-3 md:col-span-1 text-sm text-slate-500 md:text-right">
                        Tổng ghế: {totalSeats} | <span className="text-emerald-600 dark:text-emerald-400">Có sẵn: {availableSeats}</span> |{" "}
                        <span className="text-slate-500 dark:text-slate-400">Không khả dụng: {unavailableSeats}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="overflow-auto p-3 flex justify-center border rounded-lg bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-border-dark">
                        <div
                            className="inline-grid gap-2"
                            style={{
                                gridTemplateColumns: `repeat(${clampedCols}, minmax(40px, 1fr))`,
                            }}
                        >
                            {ROWS.map((r) => (
                                <div key={r} className="contents">
                                    {Array.from({ length: clampedCols }).map((_, i) => {
                                        const id = `${r}${padCol(i + 1)}`;
                                        const available = seatStates[id] ?? true;
                                        const bg = available ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-300";
                                        return (
                                            <button
                                                key={id}
                                                title={`${id} — ${available ? "Available" : "Unavailable"}`}
                                                onClick={() => toggleState(id)}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    toggleState(id);
                                                }}
                                                className={`p-2 rounded text-xs border ${bg} border-slate-200 hover:scale-105 transition-transform`}
                                            >
                                                {id}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-3">
                    {(nameMissing || addressMissing || noSeats) && (
                        <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 justify-start mr-auto">
                            {nameMissing && <div>Tên phòng không được để trống.</div>}
                            {addressMissing && <div>Địa chỉ không được để trống.</div>}
                            {noSeats && <div>Số hàng và số cột phải lớn hơn 0.</div>}
                        </div>
                    )}
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border">
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        className={`px-4 py-2 rounded-lg bg-primary text-white ${isSaveDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"}`}
                    >
                        Lưu phòng
                    </button>
                </div>
            </div>
        </div>
    );
}
