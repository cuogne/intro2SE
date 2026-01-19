import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Ticket, ArrowRight, Home, RefreshCcw } from "lucide-react";
import { getBookingById } from "../services/bookingService";

const PaymentSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // Backend cần config redirect về: http://localhost:5173/payment/success?bookingId=...
    let bookingId = searchParams.get("bookingId");

    const extraData = searchParams.get("extraData");
    if (!bookingId && extraData) {
        try {
            const decoded = atob(extraData);
            const data = JSON.parse(decoded);
            if (data.bookingId) {
                bookingId = data.bookingId;
            }
        } catch (e) {
            console.error("Failed to parse extraData", e);
        }
    }

    // Nếu dùng MoMo, nó có thể trả về resultCode. 0 là thành công.
    const resultCode = searchParams.get("resultCode");

    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

    useEffect(() => {
        const checkBookingStatus = async () => {
            if (!bookingId) {
                setStatus("failed");
                return;
            }

            // resultCode momo khác 0 -> thất bại
            if (resultCode && resultCode !== "0") {
                setStatus("failed");
                return;
            }

            // status zalopay khac 1 -> thất bại
            const zalopayStatus = searchParams.get("status");
            if (zalopayStatus && zalopayStatus !== "1") {
                setStatus("failed");
                return;
            }

            try {
                const booking = await getBookingById(bookingId);
                if (booking && booking.status === "confirmed") {
                    setStatus("success");
                    // Tự động chuyển trang sau 5s
                    setTimeout(() => navigate(`/booking/${bookingId}`), 5000);
                } else {
                    setStatus(booking?.status === "confirmed" ? "success" : "loading");

                    // Nếu vẫn loading (pending), thử check lại sau 2s
                    if (booking?.status === "pending") {
                        setTimeout(checkBookingStatus, 2000);
                    }
                }
            } catch (error) {
                console.error(error);
                setStatus("failed");
            }
        };

        checkBookingStatus();
    }, [bookingId, resultCode, navigate]);

    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Đang xác nhận kết quả thanh toán...</h2>
                <p className="text-gray-500 mt-2">Vui lòng không tắt trình duyệt</p>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-12 text-center">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thanh toán thất bại</h1>
                    <p className="text-gray-600 dark:text-text-secondary mb-8">Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình thanh toán.</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate("/movies")}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-[#232f48] text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 transition-colors font-bold"
                        >
                            <Home className="w-5 h-5" />
                            Về trang chủ
                        </button>
                        {bookingId && (
                            <button
                                onClick={() => navigate(`/payment/${bookingId}`)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Thử thanh toán lại
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-12 text-center">
                <div className="mb-6">
                    <CheckCircle className="w-20 h-20 text-green-500 dark:text-green-400 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thanh toán thành công!</h1>
                    <p className="text-gray-600 dark:text-text-secondary">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
                </div>

                <div className="bg-gray-100 dark:bg-[#232f48] rounded-lg p-6 mb-6">
                    <p className="text-gray-600 dark:text-text-secondary mb-4">Vé điện tử đã được gửi đến email của bạn</p>
                    <p className="text-sm text-gray-600 dark:text-text-secondary">Bạn sẽ được chuyển đến trang vé trong giây lát...</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(`/booking/${bookingId}`)}
                        className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold shadow-lg shadow-primary/30"
                    >
                        <Ticket className="w-5 h-5" />
                        Xem vé ngay
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
