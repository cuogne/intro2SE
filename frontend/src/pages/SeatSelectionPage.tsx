import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchShowtimeById, type ShowtimeDetail, type ShowtimeSeat } from "../services/showtimeService";
import { reserveSeats, updateBookingSeats, type Seat } from "../services/bookingService";
import { Clock, ArrowLeft } from "lucide-react";

const SeatSelectionPage: React.FC = () => {
    const { showtimeId } = useParams<{ showtimeId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [showtime, setShowtime] = useState<ShowtimeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(300); // 5 phút = 300 giây
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!user) {
            navigate("/auth");
            return;
        }

        if (!showtimeId) {
            navigate("/movies");
            return;
        }

        const loadShowtime = async () => {
            setLoading(true);
            const data = await fetchShowtimeById(showtimeId);
            if (data) {
                setShowtime(data);
            } else {
                setError("Không tìm thấy suất chiếu");
            }
            setLoading(false);
        };

        loadShowtime();
    }, [showtimeId, user, navigate]);

    // Timer countdown
    useEffect(() => {
        if (!bookingId || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setError("Hết thời gian giữ ghế. Vui lòng chọn lại.");
                    setSelectedSeats([]);
                    setBookingId(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [bookingId, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSeatClick = async (row: string, number: number) => {
        if (!showtime) return;

        const seat: Seat = { row, number };
        const isSelected = selectedSeats.some((s) => s.row === row && s.number === number);
        const seatInfo = showtime.seats?.find((s) => s.row === row && s.number === number);

        if (seatInfo?.isBooked) {
            setError("Ghế này đã được đặt");
            return;
        }

        setError("");

        try {
            if (isSelected) {
                // Xóa ghế
                if (bookingId) {
                    await updateBookingSeats(bookingId, "remove", [seat]);
                }
                setSelectedSeats((prev) => prev.filter((s) => !(s.row === row && s.number === number)));
            } else {
                // Thêm ghế
                if (bookingId) {
                    // Thêm vào booking hiện có
                    await updateBookingSeats(bookingId, "add", [seat]);
                } else {
                    // Tạo booking mới
                    const result = await reserveSeats(showtimeId!, [seat]);
                    setBookingId(result.bookingId);
                    const expiresIn = new Date(result.holdExpiresAt).getTime() - Date.now();
                    setTimeLeft(Math.floor(expiresIn / 1000));
                }
                setSelectedSeats((prev) => [...prev, seat]);
            }
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi chọn ghế");
        }
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            setError("Vui lòng chọn ít nhất một ghế");
            return;
        }
        if (bookingId) {
            navigate(`/payment/${bookingId}`);
        }
    };

    const getSeatStatus = (row: string, number: number) => {
        const seatInfo = showtime?.seats?.find((s) => s.row === row && s.number === number);
        if (seatInfo?.isBooked) return "booked";
        if (selectedSeats.some((s) => s.row === row && s.number === number)) return "selected";
        return "available";
    };

    // Nhóm ghế theo hàng
    const getEffectiveSeats = () => {
        if (showtime?.seats && showtime.seats.length > 0) {
            return showtime.seats;
        }

        // Nếu không có ghế từ API, tạo ma trận ghế mặc định (5 hàng x 10 ghế)
        const mockSeats: ShowtimeSeat[] = [];
        const rows = ["A", "B", "C", "D", "E"];
        rows.forEach((row) => {
            for (let i = 1; i <= 10; i++) {
                mockSeats.push({
                    row,
                    number: i,
                    isBooked: false, // Mặc định chưa đặt
                    status: "available",
                });
            }
        });
        return mockSeats;
    };

    const seatsToRender = showtime ? getEffectiveSeats() : [];

    // Nhóm ghế theo hàng
    const groupedSeats: { [key: string]: typeof seatsToRender } = {};

    seatsToRender.forEach((seat) => {
        if (!groupedSeats[seat.row]) {
            groupedSeats[seat.row] = [];
        }
        groupedSeats[seat.row].push(seat);
    });

    const totalPrice = showtime ? selectedSeats.length * showtime.price : 0;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-900 dark:text-white">Đang tải...</div>
            </div>
        );
    }

    if (!showtime) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500 dark:text-red-400">{error || "Không tìm thấy suất chiếu"}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white hover:text-primary transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Quay lại
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Phần chọn ghế */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{showtime.movie.title}</h2>
                            <p className="text-gray-600 dark:text-text-secondary">
                                {showtime.cinema.name} • {new Date(showtime.startTime).toLocaleString("vi-VN")}
                            </p>
                        </div>

                        {/* Timer */}
                        {bookingId && timeLeft > 0 && (
                            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                <span className="text-yellow-400 font-bold">Thời gian giữ ghế: {formatTime(timeLeft)}</span>
                            </div>
                        )}

                        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">{error}</div>}

                        {/* Màn hình */}
                        <div className="mb-8 text-center">
                            <div className="inline-block bg-linear-to-r from-gray-600 to-gray-800 text-white px-8 py-2 rounded-t-lg">MÀN HÌNH</div>
                        </div>

                        {/* Sơ đồ ghế */}
                        <div className="space-y-4 flex flex-col items-center">
                            {Object.keys(groupedSeats)
                                .sort()
                                .map((row) => (
                                    <div key={row} className="flex items-center gap-2">
                                        <div className="w-8 text-center text-gray-900 dark:text-white font-bold">{row}</div>
                                        <div className="flex gap-2 flex-wrap">
                                            {groupedSeats[row]
                                                .sort((a, b) => a.number - b.number)
                                                .map((seat) => {
                                                    const status = getSeatStatus(seat.row, seat.number);
                                                    return (
                                                        <button
                                                            key={`${seat.row}-${seat.number}`}
                                                            onClick={() => handleSeatClick(seat.row, seat.number)}
                                                            disabled={status === "booked"}
                                                            className={`w-10 h-10 rounded text-xs font-bold transition-all ${
                                                                status === "booked"
                                                                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                                                    : status === "selected"
                                                                    ? "bg-primary text-white scale-110"
                                                                    : "bg-gray-200 dark:bg-[#232f48] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#324467]"
                                                            }`}
                                                        >
                                                            {seat.number}
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Chú thích */}
                        <div className="mt-8 flex gap-6 justify-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-gray-200 dark:bg-[#232f48]"></div>
                                <span className="text-gray-600 dark:text-text-secondary">Trống</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-primary"></div>
                                <span className="text-gray-600 dark:text-text-secondary">Đã chọn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-700"></div>
                                <span className="text-gray-600 dark:text-text-secondary">Đã đặt</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần tổng kết */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông tin đặt vé</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600 dark:text-text-secondary">
                                <span>Số ghế:</span>
                                <span className="text-gray-900 dark:text-white">{selectedSeats.length}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-text-secondary">
                                <span>Giá vé:</span>
                                <span className="text-gray-900 dark:text-white">{showtime.price.toLocaleString("vi-VN")} đ</span>
                            </div>
                            <div className="border-t border-gray-300 dark:border-[#232f48] pt-3 flex justify-between">
                                <span className="text-gray-900 dark:text-white font-bold">Tổng tiền:</span>
                                <span className="text-primary font-bold text-xl">{totalPrice.toLocaleString("vi-VN")} đ</span>
                            </div>
                        </div>

                        {selectedSeats.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 dark:text-text-secondary mb-2">Ghế đã chọn:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map((seat, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-primary/20 text-primary rounded text-sm">
                                            {seat.row}-{seat.number}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleProceedToPayment}
                            disabled={selectedSeats.length === 0 || timeLeft <= 0}
                            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        >
                            {timeLeft <= 0 ? "Hết thời gian" : "Thanh toán"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionPage;
