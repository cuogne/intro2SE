import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Ticket, ArrowRight } from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    // Nếu có bookingId, redirect đến trang vé sau 3 giây
    if (bookingId) {
      const timer = setTimeout(() => {
        navigate(`/ticket/${bookingId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingId, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-12 text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 dark:text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-600 dark:text-text-secondary">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-[#232f48] rounded-lg p-6 mb-6">
          <p className="text-gray-600 dark:text-text-secondary mb-4">
            Vé điện tử đã được gửi đến email của bạn
          </p>
          <p className="text-sm text-gray-600 dark:text-text-secondary">
            Vui lòng đến rạp đúng giờ và trình mã QR để vào xem phim
          </p>
        </div>

        {bookingId ? (
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-text-secondary">
              Đang chuyển đến trang vé...
            </p>
            <button
              onClick={() => navigate(`/ticket/${bookingId}`)}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold"
            >
              <Ticket className="w-5 h-5" />
              Xem vé ngay
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/bookings')}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold"
            >
              <Ticket className="w-5 h-5" />
              Xem lịch sử đặt vé
            </button>
            <button
              onClick={() => navigate('/movies')}
              className="block mx-auto text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              Tiếp tục đặt vé
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

