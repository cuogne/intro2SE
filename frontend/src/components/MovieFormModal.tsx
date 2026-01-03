import { useEffect, useState } from "react";
import type { Movie, MovieStatus } from "../services/movieService";
import {
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  ConfigProvider,
  theme,
  message,
} from "antd";
import { useTheme } from "../context/ThemeContext";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  initialMovie?: Movie | null;
  onClose: () => void;
  onSave: (movie: Partial<Movie> & { _id?: string }) => void;
  saving?: boolean;
};

function toISO(dateDisplay?: string) {
  // display format expected dd/mm/yyyy -> convert to yyyy-mm-dd
  if (!dateDisplay) return "";
  const parts = dateDisplay.split("/");
  if (parts.length !== 3) return dateDisplay;
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export default function MovieFormModal({
  open,
  initialMovie = null,
  onClose,
  onSave,
  saving = false,
}: Props) {
  const { isDarkTheme } = useTheme();
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState<number | "">("");
  const [releaseDate, setReleaseDate] = useState(""); // iso yyyy-mm-dd for input
  const [status, setStatus] = useState<MovieStatus>("now_showing");
  const [genresText, setGenresText] = useState(""); // comma separated
  const [trailer, setTrailer] = useState("");
  const [description, setDescription] = useState("");

  // poster file handling
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState("");

  useEffect(() => {
    if (initialMovie) {
      setTitle(initialMovie.title || "");
      setMinutes(initialMovie.minutes ?? "");
      const rd = initialMovie.releaseDate || "";
      if (rd.includes("-")) setReleaseDate(rd.slice(0, 10));
      else setReleaseDate(rd.includes("/") ? toISO(rd) : rd);
      setStatus((initialMovie.status || "now_showing") as MovieStatus);
      setGenresText((initialMovie.genre || []).join(", "));
      setTrailer(initialMovie.trailerLink || "");
      setPosterFile(null);
      setPosterPreview(initialMovie.posterImg || "");
      setDescription(initialMovie.description || "");
    } else {
      setTitle("");
      setMinutes("");
      setReleaseDate("");
      setStatus("now_showing");
      setGenresText("");
      setTrailer("");
      setPosterFile(null);
      setPosterPreview("");
      setDescription("");
    }
  }, [initialMovie, open]);

  if (!open) return null;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (saving) return; // prevent double submit
    // basic validation
    if (!title.trim()) {
      message.warning("Tiêu đề không được để trống");
      return;
    }
    const min = typeof minutes === "number" ? minutes : Number(minutes || 0);
    if (!min || min <= 0) {
      message.warning("Thời lượng phải lớn hơn 0");
      return;
    }
    const genres = genresText
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    let imageUrl = posterPreview; // Use existing preview if no new file

    // Upload to Cloudinary if there's a new file
    if (posterFile) {
      const hide = message.loading("Đang upload ảnh...", 0);
      try {
        const formData = new FormData();
        formData.append("file", posterFile);
        formData.append("upload_preset", "movies_preset");
        formData.append("cloud_name", "dd6hyrrdf");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dd6hyrrdf/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        hide();
        if (!response.ok) {
          throw new Error("Upload ảnh thất bại");
        }

        const data = await response.json();
        imageUrl = data.secure_url;
        message.success("Upload ảnh thành công");
      } catch (error) {
        hide();
        console.error("Lỗi upload ảnh:", error);
        message.error("Không thể upload ảnh. Vui lòng thử lại.");
        return;
      }
    }

    const movie: Partial<Movie> = {
      _id: initialMovie?._id,
      title: title.trim(),
      minutes: min,
      releaseDate: releaseDate || undefined,
      status,
      genre: genres,
      description: description?.trim() || undefined,
      posterImg: imageUrl || "",
      trailerLink: trailer?.trim() || undefined,
    };
    onSave(movie);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialMovie ? "Chỉnh sửa Phim" : "Thêm Phim Mới"}
          </h3>
          <button
            className="text-slate-400 hover:text-red-500 rounded-lg p-1 hover:bg-red-500/10 transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: isDarkTheme() ? "#111318" : "#f8fafc",
              colorBorder: isDarkTheme() ? "#2d3748" : "#e2e8f0",
            },
            algorithm: isDarkTheme()
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          }}
        >
          <form
            onSubmit={submit}
            className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <div className="md:col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 dark:text-text-secondary uppercase tracking-wider">
                    Tiêu đề phim <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={title}
                    disabled={saving}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ height: "44px" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Thời lượng (phút) <span className="text-red-500">*</span>
                  </label>
                  <InputNumber
                    value={minutes === "" ? null : minutes}
                    disabled={saving}
                    onChange={(val) => setMinutes(val ?? "")}
                    min={1}
                    style={{ height: "44px", width: "100%" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Ngày phát hành
                  </label>
                  <DatePicker
                    value={releaseDate ? dayjs(releaseDate) : null}
                    disabled={saving}
                    onChange={(date) =>
                      setReleaseDate(date ? date.format("YYYY-MM-DD") : "")
                    }
                    format="DD/MM/YYYY"
                    style={{ height: "44px", width: "100%" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Trạng thái
                  </label>
                  <Select
                    value={status}
                    disabled={saving}
                    onChange={(value) => setStatus(value as MovieStatus)}
                    style={{ height: "44px", width: "100%" }}
                  >
                    <Select.Option value="now_showing">
                      Đang chiếu
                    </Select.Option>
                    <Select.Option value="coming_soon">Sắp chiếu</Select.Option>
                    <Select.Option value="ended">Đã kết thúc</Select.Option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 dark:text-text-secondary uppercase tracking-wider">
                  Thể loại
                </label>
                <Input
                  value={genresText}
                  onChange={(e) => setGenresText(e.target.value)}
                  placeholder="Nhập thể loại, phân tách bằng dấu phẩy"
                  style={{ height: "44px" }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Link Trailer (Youtube)
                </label>
                <Input
                  value={trailer}
                  onChange={(e) => setTrailer(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{ height: "44px" }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mô tả phim
                </label>
                <Input.TextArea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-5">
              <div className="space-y-1.5 h-full flex flex-col">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Poster Phim
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer?.files || []);
                    const imageFiles = files.filter((f) =>
                      f.type.startsWith("image/")
                    );
                    if (imageFiles.length > 0) {
                      const lastFile = imageFiles[imageFiles.length - 1];
                      setPosterFile(lastFile);
                      setPosterPreview(URL.createObjectURL(lastFile));
                    }
                  }}
                  className="flex-1 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-background-dark hover:bg-white/5 dark:hover:bg-border-dark/20 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center group min-h-60"
                  onClick={() =>
                    document.getElementById("poster-file-input")?.click()
                  }
                >
                  <input
                    id="poster-file-input"
                    type="file"
                    disabled={saving}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        const lastFile = files[files.length - 1];
                        setPosterFile(lastFile);
                        setPosterPreview(URL.createObjectURL(lastFile));
                      }
                    }}
                  />

                  {posterPreview ? (
                    <div className="relative">
                      <div
                        className="w-48 h-64 bg-cover bg-center rounded shadow-sm"
                        style={{ backgroundImage: `url('${posterPreview}')` }}
                      />
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
                        <span className="material-symbols-outlined text-slate-400 text-3xl group-hover:text-primary">
                          cloud_upload
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                        Kéo thả ảnh vào đây
                      </p>
                      <p className="text-xs text-slate-500 dark:text-text-secondary">
                        hoặc click để chọn file
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button onClick={onClose} disabled={saving} size="large">
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  onClick={submit}
                  disabled={saving}
                  loading={saving}
                  size="large"
                >
                  {saving ? "Đang lưu..." : "Lưu Phim"}
                </Button>
              </div>
            </div>
          </form>
        </ConfigProvider>
      </div>
    </div>
  );
}
