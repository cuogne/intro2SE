import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById, type BookingItem } from "../services/bookingService";
import { Calendar, MapPin, Ticket, Clock, User, CreditCard, ArrowLeft, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function BookingDetailPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<BookingItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooking = async () => {
            if (!bookingId) {
                navigate("/booking-history");
                return;
            }

            setLoading(true);
            try {
                const data = await getBookingById(bookingId);
                if (!data) {
                    navigate("/booking-history");
                    return;
                }
                setBooking(data);
            } catch (error) {
                console.error("Error loading booking:", error);
                navigate("/booking-history");
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
    }, [bookingId, navigate]);
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-base font-bold">Đã thanh toán</span>;
            case "pending":
                return <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-base font-bold">Chờ thanh toán</span>;
            case "cancelled":
                return <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-base font-bold">Đã hủy</span>;
            default:
                return <span className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-full text-base font-bold">{status}</span>;
        }
    };

    const handleDownload = () => {
        if (!booking) return;

        // Get the QR code SVG element
        const svg = document.querySelector(".qr-code-container svg");
        if (!svg) return;

        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        // Create download link
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-${booking.id}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-900 dark:text-white">Đang tải...</div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    const showtimeDate = new Date(booking.startTime);
    const isPast = showtimeDate < new Date();

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <button onClick={() => navigate("/booking-history")} className="flex items-center gap-2 text-gray-600 dark:text-text-secondary hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại lịch sử đặt vé</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chi tiết đặt vé</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Movie & Status */}
                    <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{booking.movie}</h2>
                                {getStatusBadge(booking.status)}
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-primary">{booking.totalPrice.toLocaleString("vi-VN")} đ</p>
                                <p className="text-sm text-gray-600 dark:text-text-secondary mt-1">{booking.quantity} vé</p>
                            </div>
                        </div>

                        {isPast && booking.status === "confirmed" && (
                            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <p className="text-yellow-400 text-center font-semibold">Suất chiếu đã kết thúc</p>
                            </div>
                        )}
                    </div>

                    {/* Cinema & Showtime Info */}
                    <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thông tin suất chiếu</h3>
                        <div className="space-y-3 text-gray-600 dark:text-text-secondary">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{booking.cinema}</p>
                                    <p className="text-sm">{booking.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 flex-shrink-0" />
                                <span>
                                    {showtimeDate.toLocaleDateString("vi-VN", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 flex-shrink-0" />
                                <span>
                                    {showtimeDate.toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Ticket className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Ghế đã chọn:</p>
                                    <p className="text-base">{booking.seat.join(", ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    {(booking.paidAt || booking.paymentProvider || booking.paymentTransId) && (
                        <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thông tin thanh toán</h3>
                            <div className="space-y-3 text-gray-600 dark:text-text-secondary">
                                {booking.paidAt && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-text-secondary/70">Thời gian thanh toán</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{new Date(booking.paidAt).toLocaleString("vi-VN")}</p>
                                        </div>
                                    </div>
                                )}
                                {booking.paymentProvider && (
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-5 h-5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-text-secondary/70">Phương thức thanh toán</p>
                                            <p className="font-semibold text-gray-900 dark:text-white uppercase">{booking.paymentProvider}</p>
                                        </div>
                                    </div>
                                )}
                                {booking.paymentTransId && (
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-text-secondary/70">Mã giao dịch</p>
                                            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">{booking.paymentTransId}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Booking Info */}
                    <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thông tin đặt vé</h3>
                        <div className="space-y-3 text-gray-600 dark:text-text-secondary">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-text-secondary/70">Mã đặt vé</p>
                                    <p className="font-mono text-sm text-gray-900 dark:text-white">{booking.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-text-secondary/70">Thời gian đặt vé</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{new Date(booking.bookedAt).toLocaleString("vi-VN")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-6 sticky top-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Mã QR vé</h3>
                        <div className="qr-code-container flex justify-center mb-4">
                            <div className="bg-white p-4 rounded-lg">
                                <QRCodeSVG value={booking.id} size={200} level="H" includeMargin={true} />
                            </div>
                        </div>
                        <p className="text-sm text-center text-gray-600 dark:text-text-secondary mb-4">Quét mã QR này tại rạp để lấy vé</p>
                        <button
                            onClick={handleDownload}
                            className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Tải mã QR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
