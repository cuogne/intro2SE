import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBookingsHistory, type BookingItem } from "../services/bookingService";
import { Calendar, MapPin, Ticket, Clock } from "lucide-react";

const BookingHistoryPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/auth");
            return;
        }

        const loadBookings = async () => {
            setLoading(true);
            try {
                const data = await getBookingsHistory();
                setBookings(data || []);
                console.log("Loaded bookings:", data);
            } catch (error) {
                console.error("Error loading booking history:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [user, navigate]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">Đã thanh toán</span>;
            case "pending":
                return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">Chờ thanh toán</span>;
            case "cancelled":
                return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">Đã hủy</span>;
            default:
                return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-bold">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-900 dark:text-white">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Lịch sử đặt vé</h1>

            {bookings.length === 0 ? (
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-12 text-center border border-gray-200 dark:border-[#324467]">
                    <Ticket className="w-16 h-16 text-gray-400 dark:text-text-secondary mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-text-secondary text-lg mb-4">Bạn chưa có giao dịch nào</p>
                    <button onClick={() => navigate("/movies")} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        Đặt vé ngay
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const seatList = booking.seat.join(", ");
                        const showtimeDate = new Date(booking.startTime);
                        const isPast = showtimeDate < new Date();

                        return (
                            <div
                                key={booking.id}
                                className="bg-white flex justify-between w-full dark:bg-[#1a2332] shadow-lg border border-gray-200 dark:border-[#324467] rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-[#232f48] transition-colors cursor-pointer"
                                title="Ấn vào vé để xem chi tiết"
                                onClick={() => {
                                    if (booking.status === "confirmed") {
                                        navigate(`/ticket/${booking.id}`);
                                    }
                                }}
                            >
                                <div className="flex md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{booking.movie}</h3>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-gray-600 dark:text-text-secondary">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{booking.cinema}</span>
                                                <span className="text-text-secondary/50">•</span>
                                                <span className="text-sm">{booking.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {showtimeDate.toLocaleDateString("vi-VN", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                                <span className="text-text-secondary/50">•</span>
                                                <span>
                                                    {showtimeDate.toLocaleTimeString("vi-VN", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Ticket className="w-4 h-4" />
                                                <span>Ghế: {seatList}</span>
                                            </div>
                                            {booking.paidAt && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Thanh toán: {new Date(booking.paidAt).toLocaleString("vi-VN")}</span>
                                                </div>
                                            )}
                                            {isPast && booking.status === "confirmed" && <p className="text-sm text-yellow-400 mt-2">Đã xem</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between ml-4">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary">{booking.totalPrice.toLocaleString("vi-VN")} đ</p>
                                        <p className="text-sm text-gray-600 dark:text-text-secondary">{booking.quantity} vé</p>
                                    </div>
                                    {booking.status === "confirmed" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/ticket/${booking.id}`);
                                            }}
                                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold"
                                        >
                                            Xem vé
                                        </button>
                                    )}
                                    {booking.status === "pending" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/payment/${booking.id}`);
                                            }}
                                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold"
                                        >
                                            Thanh toán
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookingHistoryPage;
