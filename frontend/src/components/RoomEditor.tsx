import { useState, useEffect } from "react";

// seats have boolean availability: true = available, false = unavailable
type SeatState = boolean;

interface RowLayout {
    row: string;
    seats: string[];
}

import type { Cinema } from "../services/cinemaService";

// RoomEditor uses the `Cinema` model for initial and save payloads

type Props = {
    open: boolean;
    initial?: Partial<Cinema> | null;
    onClose: () => void;
    onSave: (payload: Partial<Cinema>) => void;
};

const DEFAULT_ROWS = 7;

function padCol(n: number) {
    return String(n);
}

export default function RoomEditor({ open, initial = null, onClose, onSave }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [address, setAddress] = useState(initial?.address ?? "");
    const [cols, setCols] = useState<number>(initial?.seatsCols ?? initial?.seatLayout?.[0]?.seats.length ?? 10);
    const [seatStates, setSeatStates] = useState<Record<string, SeatState>>({});
    const [rowsCount, setRowsCount] = useState<number>(initial?.seatRows ?? initial?.seatLayout?.length ?? DEFAULT_ROWS);
    const [status, setStatus] = useState<string>(initial?.status ?? "open");
    const [type, setType] = useState<string>(initial?.type ?? "custom");

    useEffect(() => {
        setName(initial?.name ?? "");
        setAddress(initial?.address ?? "");

        const initialRows = initial?.seatRows ?? initial?.seatLayout?.length ?? DEFAULT_ROWS;
        const initialCols = initial?.seatsCols ?? initial?.seatLayout?.[0]?.seats.length ?? 12;

        setCols(initialCols);
        setRowsCount(initialRows);
        setStatus(initial?.status ?? "open");
        setType(initial?.type ?? "2dstandard");

        // Build seat availability map: if initial has seatLayout, mark only those seats as available
        const states: Record<string, SeatState> = {};
        for (let r = 0; r < initialRows; r++) {
            const rowLetter = String.fromCharCode("A".charCodeAt(0) + r);
            for (let c = 0; c < initialCols; c++) {
                const id = `${rowLetter}${c + 1}`;
                let available = true;
                if (initial?.seatLayout) {
                    const rowObj = initial.seatLayout.find((x) => x.row === rowLetter);
                    available = !!(rowObj && rowObj.seats.includes(id));
                }
                states[id] = available;
            }
        }

        setSeatStates(states);
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
        const rows: RowLayout[] = ROWS.map((r) => {
            const seats = Array.from({ length: clampedCols })
                .map((_, i) => {
                    const id = `${r}${padCol(i + 1)}`;
                    const available = seatStates[id];
                    return available === false ? null : id;
                })
                .filter(Boolean) as string[];
            return { row: r, seats };
        }).filter((row) => row.seats.length > 0);

        const capacity = rows.reduce((acc, row) => acc + row.seats.length, 0);

        onSave({
            _id: initial?._id,
            name: name || "",
            address: address || "",
            status,
            type,
            seatLayout: rows,
            seatRows: clampedRows,
            seatsCols: clampedCols,
            capacity,
        });
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
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{initial?._id ? "Chỉnh sửa rạp" : "Tạo rạp mới"}</h3>
                    <button className="text-slate-400 hover:text-red-500 rounded-lg p-1 hover:bg-red-500/10 transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="">
                        <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Tên rạp</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary px-4 py-2.5 focus:border-primary focus:ring-primary"
                            placeholder="Rạp IMAX"
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
                            <option value="2dstandard">2D Tiêu chuẩn</option>
                            <option value="3dvip">3D VIP</option>
                            <option value="imax">IMAX</option>
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
                            <option value="open">Hoạt động</option>
                            <option value="renovating">Đang nâng cấp</option>
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
                                                title={`${id} — ${available ? "Có sẵn" : "Không khả dụng"}`}
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
                            {nameMissing && <div>Tên rạp không được để trống.</div>}
                            {addressMissing && <div>Địa chỉ rạp không được để trống.</div>}
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
