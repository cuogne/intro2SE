import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBookingById, type BookingItem } from "../services/bookingService";
import { createZaloPayOrder, createMomoPayment } from "../services/paymentService";
import { ArrowLeft, Info } from "lucide-react";

type PaymentMethod = "zalopay" | "momo";

const PaymentPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<BookingItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("momo");

    useEffect(() => {
        if (!user) {
            navigate("/auth");
            return;
        }
        if (!bookingId) {
            navigate("/movies");
            return;
        }

        const loadBooking = async () => {
            setLoading(true);
            try {
                const data = await getBookingById(bookingId);
                if (data) {
                    if (data.status === "confirmed") {
                        navigate(`/booking/${bookingId}`);
                        return;
                    }
                    setBooking(data);
                } else {
                    setError("Không tìm thấy đơn đặt vé");
                }
            } catch (err: any) {
                setError(err.message || "Có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };
        loadBooking();
    }, [bookingId, user, navigate]);

    const handlePayment = async () => {
        if (!bookingId) return;
        setProcessing(true);
        setError("");

        try {
            let redirectUrl = "";

            if (paymentMethod === "zalopay") {
                const result = await createZaloPayOrder(bookingId);
                if (result.order_url) {
                    redirectUrl = result.order_url;
                } else {
                    throw new Error("Lỗi: Không nhận được link thanh toán ZaloPay");
                }
            } else {
                const result = await createMomoPayment(bookingId);
                // Kiểm tra cả payUrl (thông thường) và data.payUrl (nếu bọc trong data)
                const url = result.payUrl || (result as any).data?.payUrl;

                if (url) {
                    redirectUrl = url;
                } else {
                    console.error("Momo Response:", result);
                    throw new Error("Lỗi: Không nhận được link thanh toán MoMo");
                }
            }

            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Có lỗi xảy ra khi tạo đơn thanh toán");
            setProcessing(false);
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải...</div>;

    if (!booking) return <div className="text-center py-10 text-red-500">{error || "Không tìm thấy đơn"}</div>;

    // --- SAFE DATA ---
    console.log("Booking Data:", booking);

    const totalPrice = booking.totalPrice || 0;
    const seatList = booking.seat ? booking.seat.join(", ") : "Chưa chọn ghế";

    const movieTitle = booking.movie || "Đang cập nhật";
    const cinemaName = booking.cinema || "Đang cập nhật";
    const showTime = booking.startTime ? new Date(booking.startTime).toLocaleString("vi-VN") : "Unknown";

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white hover:text-primary">
                <ArrowLeft className="w-5 h-5" /> Quay lại
            </button>

            <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Thanh toán</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Cột trái: Thông tin vé */}
                    <div>
                        <div className="bg-gray-100 dark:bg-[#232f48] rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông tin vé</h2>
                            <div className="space-y-3 text-sm text-gray-600 dark:text-text-secondary">
                                <p>
                                    <b className="text-gray-900 dark:text-white">Phim:</b> {movieTitle}
                                </p>
                                <p>
                                    <b className="text-gray-900 dark:text-white">Rạp:</b> {cinemaName}
                                </p>
                                <p>
                                    <b className="text-gray-900 dark:text-white">Suất:</b> {showTime}
                                </p>
                                <p>
                                    <b className="text-gray-900 dark:text-white">Ghế:</b> {seatList}
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
                                <span className="font-bold text-gray-900 dark:text-white">Tổng tiền:</span>
                                <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString("vi-VN")} đ</span>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Phương thức thanh toán */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Chọn phương thức</h3>
                        <div className="space-y-4 mb-6">
                            {/* MoMo */}
                            <div
                                onClick={() => setPaymentMethod("momo")}
                                className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-4 transition-all ${
                                    paymentMethod === "momo" ? "border-[#a50064] bg-[#a50064]/5" : "border-gray-200 dark:border-[#324467]"
                                }`}
                            >
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZcQPC-zWVyFOu9J2OGl0j2D220D49D0Z7BQ&s"
                                    alt="MoMo"
                                    className="w-10 h-10 rounded object-contain bg-white"
                                />
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">Ví MoMo</p>
                                    <p className="text-xs text-gray-500">Quét mã hoặc thẻ ATM</p>
                                </div>
                            </div>

                            {/* ZaloPay */}
                            <div
                                onClick={() => setPaymentMethod("zalopay")}
                                className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-4 transition-all ${
                                    paymentMethod === "zalopay" ? "border-[#0068ff] bg-[#0068ff]/5" : "border-gray-200 dark:border-[#324467]"
                                }`}
                            >
                                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" className="w-10 h-10 rounded object-contain" />
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">ZaloPay</p>
                                    <p className="text-xs text-gray-500">Đang bảo trì (Có thể lỗi)</p>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin thẻ test MoMo */}
                        {paymentMethod === "momo" && (
                            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-sm">
                                <div className="flex items-center gap-2 mb-2 text-blue-800 dark:text-blue-300 font-bold">
                                    <Info className="w-4 h-4" />
                                    <span>Thẻ Test MoMo (Nhập tại trang thanh toán)</span>
                                </div>
                                <div className="space-y-1 text-gray-700 dark:text-gray-300 font-mono text-xs">
                                    <p>
                                        Số thẻ: <span className="select-all font-bold">9704000000000018</span>
                                    </p>
                                    <p>
                                        Họ tên: <span className="select-all font-bold">NGUYEN VAN A</span>
                                    </p>
                                    <p>
                                        Ngày PH: <span className="select-all font-bold">03/07</span>
                                    </p>
                                    <p>
                                        OTP: <span className="select-all font-bold">123456</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className={`w-full py-4 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg ${
                                paymentMethod === "momo" ? "bg-[#a50064] hover:bg-[#8d0056]" : "bg-[#0068ff] hover:bg-[#0054cc]"
                            } disabled:bg-gray-500 disabled:cursor-not-allowed`}
                        >
                            {processing ? "Đang xử lý..." : `Thanh toán ${totalPrice.toLocaleString()} đ`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
