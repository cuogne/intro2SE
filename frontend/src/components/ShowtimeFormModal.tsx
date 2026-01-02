import React, { useEffect, useState } from "react";
import { Select, DatePicker, TimePicker, InputNumber, Button, ConfigProvider, theme } from "antd";
import { useTheme } from "../context/ThemeContext";
import dayjs from "dayjs";
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
    const { isDarkTheme } = useTheme();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-lg">
                <div className="p-2 flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{initial ? "Sửa suất chiếu" : "Thêm suất chiếu"}</h3>
                    <button className="text-slate-400 hover:text-red-500 rounded-lg p-1 hover:bg-red-500/10 transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <ConfigProvider
                    theme={{
                        token: {
                            colorBgContainer: isDarkTheme() ? "#111318" : "#f8fafc",
                            colorBorder: isDarkTheme() ? "#2d3748" : "#e2e8f0",
                        },
                        algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Phim</span>
                            <Select value={movieId} onChange={(value) => setMovieId(value)} style={{ height: "44px" }}>
                                {movieOptions.map((m) => (
                                    <Select.Option key={m.id} value={m.id}>
                                        {m.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Ngày</span>
                            <DatePicker
                                value={date ? dayjs(date) : null}
                                onChange={(dateVal) => setDate(dateVal ? dateVal.format("YYYY-MM-DD") : "")}
                                format="DD/MM/YYYY"
                                style={{ height: "44px", width: "100%" }}
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Thời gian bắt đầu</span>
                            <TimePicker
                                value={startTime ? dayjs(startTime, "HH:mm") : null}
                                onChange={(time) => setStartTime(time ? time.format("HH:mm") : "")}
                                format="HH:mm"
                                style={{ height: "44px", width: "100%" }}
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Thời gian kết thúc</span>
                            <TimePicker
                                value={endTime ? dayjs(endTime, "HH:mm") : null}
                                onChange={(time) => setEndTime(time ? time.format("HH:mm") : "")}
                                format="HH:mm"
                                style={{ height: "44px", width: "100%" }}
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Phòng chiếu</span>
                            <Select value={cinemaId} onChange={(value) => setCinemaId(value)} style={{ height: "44px" }}>
                                {roomOptions.map((r) => (
                                    <Select.Option key={r._id} value={r._id}>
                                        {r.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </label>

                        <div className="flex flex-col">
                            <span className="text-sm text-slate-700 dark:text-slate-300 mb-2">Giá bán (VND)</span>
                            <InputNumber value={price ? Number(price) : null} onChange={(val) => setPrice(val?.toString() || "0")} min={0} step={1000} style={{ height: "44px", width: "100%" }} />
                        </div>
                    </div>

                    {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Button onClick={onClose} size="large">
                            Hủy
                        </Button>
                        <Button type="primary" onClick={handleSave} disabled={saving} loading={saving} size="large">
                            {saving ? "Đang lưu" : "Lưu"}
                        </Button>
                    </div>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default ShowtimeFormModal;
