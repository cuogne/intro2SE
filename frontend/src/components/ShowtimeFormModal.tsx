import React, { useEffect, useState } from "react";
// Inlined type: Showtime

// Modal input shape (used for both create and edit)
interface ShowtimeInput {
    id?: string;
    movieId: string;
    cinemaId: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    price: number;
}

interface Props {
    open: boolean;
    initial?: Partial<ShowtimeInput> & { id?: string };
    onClose: () => void;
    // onSave receives the prepared payload (startTime/endTime are ISO strings)
    onSave: (s: { id?: string; movieId: string; cinemaId: string; startTime: string; endTime?: string; price?: number }) => void;
    movieOptions: { id: string; title: string }[];
    roomOptions: { _id: string; name: string }[];
    saving?: boolean;
}

const ShowtimeFormModal: React.FC<Props> = ({ open, initial, onClose, onSave, movieOptions, roomOptions, saving = false }) => {
    const [movieId, setMovieId] = useState<string>("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("19:00");
    const [endTime, setEndTime] = useState("21:00");
    const [cinemaId, setCinemaId] = useState<string>("");
    const [price, setPrice] = useState<string>("45000");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initial) {
            setMovieId(initial.movieId ?? movieOptions[0]?.id ?? "");
            setDate(initial.date ?? "");
            setStartTime(initial.startTime ?? "");
            setEndTime(initial.endTime ?? "");
            setCinemaId(initial.cinemaId ?? roomOptions[0]?._id ?? "");
            setPrice(initial.price?.toString() ?? "45000");
            setError(null);
        } else {
            setMovieId(movieOptions[0]?.id ?? "");
            setDate("");
            setStartTime("");
            setEndTime("");
            setCinemaId(roomOptions[0]?._id ?? "");
            setPrice("45000");
            setError(null);
        }
    }, [initial, movieOptions, roomOptions, open]);

    if (!open) return null;

    function validate() {
        if (!movieId) return "Chọn phim";
        if (!date) return "Chọn ngày";
        if (!startTime || !endTime) return "Nhập thời gian bắt đầu và kết thúc";
        if (!cinemaId) return "Chọn phòng chiếu";
        if (!price || Number(price) <= 0) return "Nhập giá bán hợp lệ";
        return null;
    }

    function handleSave() {
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        // Build ISO start/end times using date + times
        const start = new Date(`${date}T${startTime}`);
        let end = new Date(`${date}T${endTime}`);

        // If end is before or equal to start, roll it to the next day
        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }

        const payload = {
            id: initial?.id,
            movieId,
            cinemaId,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            price: Number(price),
        };

        onSave(payload);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-lg">
                <div className="p-2 flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{initial ? "Sửa suất chiếu" : "Thêm suất chiếu"}</h3>
                    <button className="text-slate-400 hover:text-red-500 rounded-lg p-1 hover:bg-red-500/10 transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col">
                        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Phim</span>
                        <select
                            value={movieId}
                            onChange={(e) => setMovieId(e.target.value)}
                            className="form-select w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 px-3"
                        >
                            {movieOptions.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.title}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Ngày</span>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="form-input w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 px-3"
                        />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Thời gian bắt đầu</span>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="form-input w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 px-3"
                        />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Thời gian kết thúc</span>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="form-input w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 px-3"
                        />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Phòng chiếu</span>

                        <select
                            value={cinemaId}
                            onChange={(e) => setCinemaId(e.target.value)}
                            className="form-select w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 px-3"
                        >
                            {roomOptions.map((r) => (
                                <option key={r._id} value={r._id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Giá bán (VND)</span>
                        <input
                            type="number"
                            min={0}
                            step={1000}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="form-input w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 px-3"
                        />
                    </div>
                </div>

                {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white active:scale-95"
                    >
                        Hủy
                    </button>
                    <button onClick={handleSave} disabled={saving} className={`px-4 py-2 rounded-lg bg-primary text-white shadow-md active:scale-95 ${saving ? "opacity-70 pointer-events-none" : ""}`}>
                        {saving ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                                Đang lưu
                            </span>
                        ) : (
                            "Lưu"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowtimeFormModal;
