import { useEffect, useState } from "react";
// Inlined type: Movie and MovieStatus
type MovieStatus = "now_showing" | "coming_soon" | "ended";

interface Movie {
    id: string;
    title: string;
    duration: number;
    genres: string[];
    releaseDate: string;
    status: MovieStatus;
    poster: string;
    trailer?: string;
}

type Props = {
    open: boolean;
    initialMovie?: Movie | null;
    onClose: () => void;
    onSave: (movie: Partial<Movie> & { id?: string }) => void;
};

function toISO(dateDisplay?: string) {
    // display format expected dd/mm/yyyy -> convert to yyyy-mm-dd
    if (!dateDisplay) return "";
    const parts = dateDisplay.split("/");
    if (parts.length !== 3) return dateDisplay;
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}
function toDisplay(iso?: string) {
    if (!iso) return "";
    // accept yyyy-mm-dd
    if (iso.includes("-")) {
        const [y, m, d] = iso.split("-");
        return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
    }
    return iso;
}

export default function MovieFormModal({ open, initialMovie = null, onClose, onSave }: Props) {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState<number | "">("");
    const [releaseDate, setReleaseDate] = useState(""); // iso yyyy-mm-dd for input
    const [status, setStatus] = useState<MovieStatus>("now_showing");
    const [genresText, setGenresText] = useState(""); // comma separated
    const [trailer, setTrailer] = useState("");

    // poster file handling
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState("");

    useEffect(() => {
        if (initialMovie) {
            setTitle(initialMovie.title || "");
            setDuration(initialMovie.duration || "");
            setReleaseDate(toISO(initialMovie.releaseDate));
            setStatus(initialMovie.status || "now_showing");
            setGenresText((initialMovie.genres || []).join(", "));
            setTrailer(initialMovie.trailer || "");
            setPosterFile(null);
            setPosterPreview(initialMovie.poster || "");
        } else {
            setTitle("");
            setDuration("");
            setReleaseDate("");
            setStatus("now_showing");
            setGenresText("");
            setTrailer("");
            setPosterFile(null);
            setPosterPreview("");
        }
    }, [initialMovie, open]);

    if (!open) return null;

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        // basic validation
        if (!title.trim()) return alert("Tiêu đề không được để trống");
        const dur = typeof duration === "number" ? duration : Number(duration || 0);
        if (!dur || dur <= 0) return alert("Thời lượng phải lớn hơn 0");
        const genres = genresText
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean);

        const proceedSave = (posterData?: string) => {
            const movie: Partial<Movie> = {
                id: initialMovie?.id,
                title: title.trim(),
                duration: dur,
                releaseDate: toDisplay(releaseDate),
                status,
                genres,
                poster: posterData || posterPreview || "",
                trailer: trailer?.trim() || undefined,
            };
            onSave(movie);
        };

        if (posterFile) {
            const reader = new FileReader();
            reader.onload = () => {
                const data = reader.result as string;
                proceedSave(data);
            };
            reader.readAsDataURL(posterFile);
        } else {
            proceedSave();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{initialMovie ? "Chỉnh sửa Phim" : "Thêm Phim Mới"}</h3>
                    <button className="text-slate-400 hover:text-red-500 rounded-lg p-1 hover:bg-red-500/10 transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 dark:text-text-secondary uppercase tracking-wider">
                                    Tiêu đề phim <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary px-4 py-2.5 focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Thời lượng (phút) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
                                    type="number"
                                    className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary px-4 py-2.5 focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngày phát hành</label>
                                <input
                                    value={releaseDate}
                                    onChange={(e) => setReleaseDate(e.target.value)}
                                    type="date"
                                    className="w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white pl-4 pr-10 py-2.5 focus:outline-none focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as MovieStatus)}
                                    className="w-full appearance-none rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white pl-4 pr-10 py-2.5 focus:outline-none focus:border-primary focus:ring-primary cursor-pointer text-sm"
                                >
                                    <option value="now_showing">Đang chiếu</option>
                                    <option value="coming_soon">Sắp chiếu</option>
                                    <option value="ended">Đã kết thúc</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 dark:text-text-secondary uppercase tracking-wider">Thể loại</label>
                            <input
                                value={genresText}
                                onChange={(e) => setGenresText(e.target.value)}
                                placeholder="Nhập thể loại, phân tách bằng dấu phẩy"
                                className="w-full rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-4 py-2.5"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Link Trailer (Youtube)</label>
                            <input
                                value={trailer}
                                onChange={(e) => setTrailer(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white px-4 py-2.5"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mô tả phim</label>
                            <textarea
                                className="w-full form-input rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-5">
                        <div className="space-y-1.5 h-full flex flex-col">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Poster Phim</label>
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const f = e.dataTransfer?.files?.[0];
                                    if (f && f.type.startsWith("image/")) {
                                        setPosterFile(f);
                                        setPosterPreview(URL.createObjectURL(f));
                                    }
                                }}
                                className="flex-1 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-background-dark hover:bg-white/5 dark:hover:bg-border-dark/20 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center group min-h-60"
                                onClick={() => document.getElementById("poster-file-input")?.click()}
                            >
                                <input
                                    id="poster-file-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            setPosterFile(f);
                                            setPosterPreview(URL.createObjectURL(f));
                                        }
                                    }}
                                />

                                {posterPreview ? (
                                    <div className="relative">
                                        <div className="w-48 h-64 bg-cover bg-center rounded shadow-sm" style={{ backgroundImage: `url('${posterPreview}')` }} />
                                        <button
                                            type="button"
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                setPosterFile(null);
                                                setPosterPreview("");
                                            }}
                                            className="absolute -top-2 -right-2 bg-white dark:bg-[#111318] rounded-full p-1 shadow"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-slate-400 text-3xl group-hover:text-primary">cloud_upload</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Kéo thả ảnh vào đây</p>
                                        <p className="text-xs text-slate-500 dark:text-text-secondary">hoặc click để chọn file</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                onClick={submit}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-blue-800 shadow-lg shadow-primary/25 transition-colors"
                            >
                                Lưu Phim
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
