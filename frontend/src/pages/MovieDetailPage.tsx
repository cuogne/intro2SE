import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Calendar, MapPin, Play, Ticket, X } from "lucide-react";
import { fetchMovieDetail } from "../services/movieService";
import type { Movie } from "../services/movieService";
import {
  fetchShowtimesByMovie,
  getFixedDates,
} from "../services/showtimeService";
import type { CinemaShowtimeGroup } from "../services/showtimeService";

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  // State cho Lịch chiếu
  const [dates] = useState(getFixedDates());
  const [selectedDate, setSelectedDate] = useState(dates[0]); // Mặc định chọn hôm nay
  const [theaterGroups, setTheaterGroups] = useState<CinemaShowtimeGroup[]>([]);

  // State cho Modal Trailer
  const [showTrailer, setShowTrailer] = useState(false);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";
  };

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      const data = await fetchMovieDetail(id);
      setMovie(data);
      setLoading(false);
    };
    loadMovie();
  }, [id]);

  useEffect(() => {
    const loadShowtimes = async () => {
      if (!id) return;
      const data = await fetchShowtimesByMovie(id, selectedDate.fullDate);
      setTheaterGroups(data);
    };
    loadShowtimes();
  }, [id, selectedDate]);

  if (loading)
    return (
      <div className="text-center py-20 text-white dark:text-white">
        Đang tải dữ liệu...
      </div>
    );
  if (!movie)
    return (
      <div className="text-center py-20 text-white dark:text-white">
        Không tìm thấy phim
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* --- PHẦN 1: INFO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-[#324467]">
            <img
              src={movie.posterImg}
              alt={movie.title}
              className="w-full h-auto object-cover aspect-[2/3]"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900">
            {movie.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-text-secondary">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#232f48] px-3 py-1 rounded">
              <Clock className="w-4 h-4" /> {movie.minutes} phút
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#232f48] px-3 py-1 rounded">
              <Calendar className="w-4 h-4" />{" "}
              {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#232f48] px-3 py-1 rounded">
              Thể loại: {movie.genre.join(", ")}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
              MÔ TẢ
            </h3>
            <p className="text-gray-600 dark:text-text-secondary leading-relaxed text-justify">
              {movie.description || "Chưa có mô tả."}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            {/* Nút Xem Trailer: Bắt sự kiện onClick */}
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-[#232f48] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#324467] rounded font-bold transition-colors cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" /> Xem Trailer
            </button>

            <button
              onClick={() => {
                // Scroll to lịch chiếu section
                const scheduleSection =
                  document.getElementById("schedule-section");
                if (scheduleSection) {
                  scheduleSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary/90 rounded font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Ticket className="w-5 h-5" /> Đặt vé ngay
            </button>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: LỊCH CHIẾU --- */}
      <div id="schedule-section" className="mt-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary dark:border-primary pl-3 text-gray-900 dark:text-white">
          Lịch chiếu
        </h2>

        {/* Selector Ngày Cố định */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {dates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center min-w-[100px] px-4 py-2 rounded border cursor-pointer transition-all ${
                selectedDate.dateStr === date.dateStr
                  ? "bg-primary text-white border-primary scale-105"
                  : "bg-gray-100 dark:bg-[#232f48] text-gray-600 dark:text-text-secondary border-transparent hover:bg-gray-200 dark:hover:bg-[#324467]"
              }`}
            >
              <span className="text-xs font-medium">{date.dayName}</span>
              <span className="text-lg font-bold">{date.dateStr}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {theaterGroups.length > 0 ? (
            theaterGroups.map((group, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {group.cinema.name}
                  </h3>
                  <div className="flex items-center text-gray-500 dark:text-text-secondary text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {group.cinema.address}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {group.showtimes.map((showtime, timeIdx) => (
                    <button
                      key={timeIdx}
                      className="px-6 py-2 border border-gray-300 dark:border-[#324467] bg-white dark:bg-[#232f48] text-gray-900 dark:text-white rounded hover:bg-primary hover:text-white hover:border-primary transition-colors font-medium text-sm cursor-pointer"
                      onClick={() => navigate(`/seats/${showtime.id}`)}
                    >
                      {showtime.time}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-text-secondary py-10 bg-gray-50 dark:bg-[#1a2332] rounded border border-dashed border-gray-300 dark:border-[#324467]">
              Không có suất chiếu nào vào ngày {selectedDate.dateStr}.
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL TRAILER --- */}
      {showTrailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-1"
            >
              <X className="w-6 h-6" />
            </button>
            {movie.trailerLink ? (
              <iframe
                src={getYoutubeEmbedUrl(movie.trailerLink)}
                title="Movie Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                Phim này chưa cập nhật Trailer
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
