import React, { useEffect, useState } from "react";
// Inlined type: Showtime
type ShowtimeStatus = "upcoming" | "running" | "done";

interface Showtime {
    id: string;
    code: string;
    title: string;
    duration: string;
    genre: string;
    startTime: string;
    endTime: string;
    date: string;
    room: string;
    status: ShowtimeStatus;
}

interface Props {
    open: boolean;
    initial?: Showtime;
    onClose: () => void;
    onSave: (s: Showtime) => void;
    movieOptions: string[];
    roomOptions: string[];
}

const ShowtimeFormModal: React.FC<Props> = ({ open, initial, onClose, onSave, movieOptions, roomOptions }) => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("19:00");
    const [endTime, setEndTime] = useState("21:00");
    const [room, setRoom] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initial) {
            setTitle(initial.title);
            setDate(initial.date);
            setStartTime(initial.startTime);
            setEndTime(initial.endTime);
            setRoom(initial.room);
            setError(null);
        } else {
            setTitle(movieOptions[0] ?? "");
            setDate("");
            setStartTime("19:00");
            setEndTime("21:00");
            setRoom(roomOptions[0] ?? "");
            setError(null);
        }
    }, [initial, movieOptions, roomOptions, open]);

    if (!open) return null;

    function validate() {
        if (!title) return "Chọn phim";
        if (!date) return "Chọn ngày";
        if (!startTime || !endTime) return "Nhập thời gian bắt đầu và kết thúc";
        if (!room) return "Chọn phòng chiếu";
        return null;
    }

    function handleSave() {
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        const id = initial?.id ?? Date.now().toString();
        const code = initial?.code ?? `S${id.slice(-5)}`;

        const newShowtime: Showtime = {
            id,
            code,
            title,
            duration: initial?.duration ?? "0h 0m",
            genre: initial?.genre ?? "",
            startTime,
            endTime,
            date,
            room,
            status: initial?.status ?? "upcoming",
        };

        onSave(newShowtime);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{initial ? "Sửa suất chiếu" : "Thêm suất chiếu"}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col">
                        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Phim</span>
                        <select
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-select w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 px-3"
                        >
                            {movieOptions.map((m) => (
                                <option key={m} value={m}>
                                    {m}
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

                    <label className="flex flex-col md:col-span-2">
                        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Phòng chiếu</span>
                        <select
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            className="form-select w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318] text-slate-900 dark:text-white h-11 px-3"
                        >
                            {roomOptions.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white active:scale-95">
                        Hủy
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-white shadow-md active:scale-95">
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowtimeFormModal;
