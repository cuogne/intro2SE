import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchShowtimeById, type ShowtimeDetail, type ShowtimeSeat } from "../services/showtimeService";
import { reserveSeats, updateBookingSeats, type Seat } from "../services/bookingService";
import { Clock, ArrowLeft } from "lucide-react";

const SeatSelectionPage: React.FC = () => {
    const { showtimeId } = useParams<{ showtimeId: string }>();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [showtime, setShowtime] = useState<ShowtimeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(300); // 5 phút = 300 giây
    const [error, setError] = useState<string>("");
    const [isSyncingSeats, setIsSyncingSeats] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        
        if (!user) {
            navigate("/auth?redirect=" + encodeURIComponent("/seats/" + showtimeId));
            return;
        }

        if (!showtimeId) {
            navigate("/movies");
            return;
        }

        const loadShowtime = async () => {
            setLoading(true);
            try {
                const data = await fetchShowtimeById(showtimeId);
                if (data) {
                    setShowtime(data);

                    if (data.pendingBooking) {
                        setBookingId(data.pendingBooking.bookingId);
                        bookingIdRef.current = data.pendingBooking.bookingId;
                        setSelectedSeats(data.pendingBooking.seats);
                        selectedSeatsRef.current = data.pendingBooking.seats;
                        const expiresIn = new Date(data.pendingBooking.holdExpiresAt).getTime() - Date.now();
                        if (expiresIn > 0) {
                            setTimeLeft(Math.floor(expiresIn / 1000));
                        }
                    } else {
                        // fallback: localStorage cache
                        try {
                            const raw = localStorage.getItem("booking_session_" + showtimeId);
                            if (raw) {
                                const cached = JSON.parse(raw);
                                if (Date.now() - cached.savedAt < 5 * 60 * 1000) {
                                    setBookingId(cached.bookingId);
                                    bookingIdRef.current = cached.bookingId;
                                    setSelectedSeats(cached.selectedSeats);
                                    selectedSeatsRef.current = cached.selectedSeats;
                                    const expiresIn = new Date(cached.holdExpiresAt).getTime() - Date.now();
                                    if (expiresIn > 0) setTimeLeft(Math.floor(expiresIn / 1000));
                                } else {
                                    localStorage.removeItem("booking_session_" + showtimeId);
                                }
                            }
                        } catch { }
                    }
                } else {
                    setError("Không tìm thấy suất chiếu");
                }
            } catch (loadError: any) {
                if (loadError.response?.status === 401) {
                    navigate("/auth?redirect=" + encodeURIComponent("/seats/" + showtimeId));
                    return;
                }

                setError(
                    loadError.response?.status === 404
                        ? "Không tìm thấy suất chiếu"
                        : "Không thể tải thông tin suất chiếu"
                );
            } finally {
                setLoading(false);
            }
        };

        loadShowtime();
    }, [showtimeId, user, authLoading, navigate]);

    const clearBookingSession = (sid: string) => {
        try {
            localStorage.removeItem("booking_session_" + sid);
        } catch { }
    };

    useEffect(() => {
        if (showtimeId && bookingId) {
            const data = { bookingId, selectedSeats, holdExpiresAt: new Date(Date.now() + timeLeft * 1000).toISOString(), savedAt: Date.now() };
            try { localStorage.setItem("booking_session_" + showtimeId, JSON.stringify(data)); } catch { }
        }
    }, [bookingId, selectedSeats, showtimeId]);

    // Timer countdown
    useEffect(() => {
        if (!bookingId) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setError("Hết thời gian giữ ghế. Vui lòng chọn lại.");
                    setSelectedSeats([]);
                    selectedSeatsRef.current = [];
                    setBookingId(null);
                    bookingIdRef.current = null;
                    if (showtimeId) clearBookingSession(showtimeId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [bookingId, showtimeId]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const bookingIdRef = useRef<string | null>(null);
    const selectedSeatsRef = useRef<Seat[]>([]);
    const seatActionQueueRef = useRef<Array<{ seat: Seat; isSelected: boolean }>>([]);
    const processingQueueRef = useRef(false);

    const updateSeatOptimistically = (seat: Seat, selected: boolean) => {
        const nextSeats = selected
            ? [...selectedSeatsRef.current, seat]
            : selectedSeatsRef.current.filter(
                (item) => !(item.row === seat.row && Number(item.number) === seat.number)
            );
        selectedSeatsRef.current = nextSeats;
        setSelectedSeats(nextSeats);

        setShowtime((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                seats: prev.seats?.map((item) =>
                    item.row === seat.row && Number(item.number) === seat.number
                        ? { ...item, status: selected ? "held_by_me" : "available" }
                        : item
                ),
            };
        });
    };

    const processSeatActions = async () => {
        if (processingQueueRef.current) return;
        processingQueueRef.current = true;
        setIsSyncingSeats(true);

        try {
            while (seatActionQueueRef.current.length > 0) {
                const action = seatActionQueueRef.current.shift();
                if (!action) continue;
                let actionSeats = [action.seat];

                try {
                    if (action.isSelected) {
                        if (bookingIdRef.current) {
                            const result = await updateBookingSeats(bookingIdRef.current, "remove", [action.seat]);
                            if (result.deleted) {
                                bookingIdRef.current = null;
                                setBookingId(null);
                                setTimeLeft(300);
                            }
                        }
                    } else {
                        const seatsToAdd = actionSeats;
                        while (
                            seatActionQueueRef.current.length > 0 &&
                            !seatActionQueueRef.current[0].isSelected
                        ) {
                            seatsToAdd.push(seatActionQueueRef.current.shift()!.seat);
                        }

                        if (bookingIdRef.current) {
                            await updateBookingSeats(bookingIdRef.current, "add", seatsToAdd);
                        } else {
                            const result = await reserveSeats(showtimeId!, seatsToAdd);
                            bookingIdRef.current = result.bookingId;
                            setBookingId(result.bookingId);
                            setTimeLeft(Math.floor((new Date(result.holdExpiresAt).getTime() - Date.now()) / 1000));
                        }
                    }
                } catch (err: any) {
                    const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Có lỗi xảy ra khi chọn ghế";
                    const normalizedMessage = msg.toLowerCase();
                    const isExpired = normalizedMessage.includes("not found") || normalizedMessage.includes("expired") || normalizedMessage.includes("not authorized");

                    if (isExpired) {
                        bookingIdRef.current = null;
                        if (!action.isSelected) {
                            try {
                                const result = await reserveSeats(showtimeId!, actionSeats);
                                bookingIdRef.current = result.bookingId;
                                setBookingId(result.bookingId);
                                setTimeLeft(Math.floor((new Date(result.holdExpiresAt).getTime() - Date.now()) / 1000));
                                continue;
                            } catch (retryError: any) {
                                setError(retryError.response?.data?.error || retryError.message || "Không thể giữ ghế");
                            }
                        }
                        bookingIdRef.current = null;
                        setBookingId(null);
                        setTimeLeft(300);
                        selectedSeatsRef.current = [];
                        setSelectedSeats([]);
                        setError("Phiên giữ ghế đã hết hạn. Vui lòng chọn lại.");
                        seatActionQueueRef.current = [];
                    } else {
                        actionSeats.forEach((seat) => updateSeatOptimistically(seat, action.isSelected));
                        setError(msg);
                    }
                }
            }
        } finally {
            processingQueueRef.current = false;
            setIsSyncingSeats(false);
        }
    };

    const handleSeatClick = (row: string, number: number) => {
        if (!showtime) return;

        const seat: Seat = { row, number };
        const isSelected = selectedSeatsRef.current.some((s) => s.row === row && Number(s.number) === number);

        setError("");
        updateSeatOptimistically(seat, !isSelected);
        seatActionQueueRef.current.push({ seat, isSelected });
        void processSeatActions();
    };

    const handleProceedToPayment = () => {
        if (isSyncingSeats || processingQueueRef.current || seatActionQueueRef.current.length > 0) {
            setError("Đang cập nhật ghế, vui lòng chờ một chút.");
            return;
        }
        if (selectedSeatsRef.current.length === 0) {
            setError("Vui lòng chọn ít nhất một ghế");
            return;
        }
        if (bookingId && showtimeId) {
            // Lưu showtimeId để có thể quay lại trang chọn ghế
            localStorage.setItem(`booking_${bookingId}_showtime`, showtimeId);
            navigate(`/payment/${bookingId}`);
        }
    };

    const getSeatStatus = (row: string, number: number) => {
        if (selectedSeats.some((s) => s.row === row && Number(s.number) === number)) return "selected";
        const seatInfo = showtime?.seats?.find((s) => s.row === row && Number(s.number) === number);
        if (!seatInfo || seatInfo.status === "booked" || seatInfo.status === "reserved") return "booked";
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

    const maxSeatNumber = Math.max(
        0,
        ...Object.values(groupedSeats).map((rowSeats) =>
            Math.max(...rowSeats.map((seat) => Number(seat.number)))
        )
    );
    const seatGridWidth = `${maxSeatNumber * 40 + Math.max(0, maxSeatNumber - 1) * 8}px`;

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
        <div className="container mx-auto px-4 pb-16 pt-6">
            <button onClick={() => navigate(`/movie/${showtime.movie._id}`, { replace: true })} className="mb-6 flex items-center gap-2 text-gray-900 dark:text-white hover:text-primary transition-colors">
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

                        {/* Timer Banner (Fixed height to prevent layout shift) */}
                        <div className="min-h-[58px] mb-6 flex items-center">
                            {bookingId && timeLeft > 0 ? (
                                <div className="w-full p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center gap-2 transition-all">
                                    <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />
                                    <span className="text-yellow-400 font-bold">Thời gian giữ ghế: {formatTime(timeLeft)}</span>
                                </div>
                            ) : (
                                <div className="w-full p-4 bg-gray-100 dark:bg-[#232f48]/50 border border-gray-200 dark:border-[#324467]/50 rounded-lg flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                    <Clock className="w-5 h-5 opacity-50" />
                                    <span>Chọn ghế để bắt đầu giữ chỗ (tối đa 5 phút)</span>
                                </div>
                            )}
                        </div>

                        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">{error}</div>}

                        {/* Màn hình */}
                        <div
                            className="mx-auto mb-8 grid w-fit max-w-full grid-cols-[2rem_0.5rem_auto]"
                            style={{ gridTemplateColumns: `2rem 0.5rem minmax(0, ${seatGridWidth})` }}
                        >
                            <div className="col-start-3">
                                <div
                                    className="flex h-12 items-center justify-center rounded-t-lg bg-linear-to-r from-gray-600 to-gray-800 px-4 text-white"
                                    style={{ width: seatGridWidth }}
                                >
                                    MÀN HÌNH
                                </div>
                            </div>
                        </div>

                        {/* Sơ đồ ghế */}
                        <div
                            className="mx-auto w-fit max-w-full space-y-4"
                            style={{ gridTemplateColumns: `2rem 0.5rem ${seatGridWidth}` }}
                        >
                            {Object.keys(groupedSeats)
                                .sort()
                                .map((row) => {
                                    // Tạo mảng từ 1 đến maxSeatNumber
                                    const allSeatNumbers = Array.from({ length: maxSeatNumber }, (_, i) => i + 1);

                                    return (
                                        <div
                                            key={row}
                                            className="grid grid-cols-[2rem_0.5rem_auto] items-center"
                                            style={{ gridTemplateColumns: `2rem 0.5rem ${seatGridWidth}` }}
                                        >
                                            <div className="text-center text-gray-900 dark:text-white font-bold">{row}</div>
                                            <div
                                                className="col-start-3 grid gap-2"
                                                style={{ gridTemplateColumns: `repeat(${maxSeatNumber}, 2.5rem)` }}
                                            >
                                                {allSeatNumbers.map((seatNumber) => {
                                                    // Kiểm tra xem ghế này có tồn tại trong dữ liệu không
                                                    const seatExists = groupedSeats[row].find((s) => Number(s.number) === seatNumber);
                                                    const status = seatExists ? getSeatStatus(row, seatNumber) : "booked";

                                                    return (
                                                        <button
                                                            key={`${row}-${seatNumber}`}
                                                            onClick={() => seatExists && handleSeatClick(row, seatNumber)}
                                                             disabled={status === "booked"}
                                                      className={`w-10 h-10 rounded text-xs font-bold transition-all ${
                                                                  status === "booked"
                                                                      ? "bg-gray-700 dark:bg-gray-900 text-white cursor-not-allowed"
                                                                      : status === "selected"
                                                                      ? "bg-primary text-white scale-110"
                                                                      : "bg-gray-200 dark:bg-[#232f48] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#324467]"
                                                              }`}
                                                        >
                                                            {seatNumber}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Chú thích */}
                        <div
                            className="mx-auto mt-8 grid w-fit max-w-full grid-cols-[2rem_0.5rem_auto] text-sm"
                            style={{ gridTemplateColumns: `2rem 0.5rem ${seatGridWidth}` }}
                        >
                            <div className="col-start-3 flex flex-nowrap justify-center gap-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-gray-200 dark:bg-[#232f48]"></div>
                                <span className="whitespace-nowrap text-gray-600 dark:text-text-secondary">Trống</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-primary"></div>
                                <span className="whitespace-nowrap text-gray-600 dark:text-text-secondary">Đã chọn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-gray-700 dark:bg-gray-900"></div>
                                <span className="whitespace-nowrap text-gray-600 dark:text-text-secondary">Đã đặt</span>
                            </div>
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
                            disabled={selectedSeats.length === 0 || timeLeft <= 0 || isSyncingSeats}
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
