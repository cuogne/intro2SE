import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookingById, type Booking } from '../services/bookingService';
import { createPaymentOrder } from '../services/paymentService';
import { ArrowLeft, CreditCard, Clock } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!bookingId) {
      navigate('/movies');
      return;
    }

    const loadBooking = async () => {
      setLoading(true);
      try {
        const data = await getBookingById(bookingId);
        if (data) {
          if (data.status === 'confirmed') {
            // Đã thanh toán rồi, chuyển đến trang vé
            navigate(`/ticket/${bookingId}`);
            return;
          }
          setBooking(data);
        } else {
          setError('Không tìm thấy đơn đặt vé');
        }
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, user, navigate]);

  const handlePayment = async () => {
    if (!bookingId) return;

    setProcessing(true);
    setError('');

    try {
      const result = await createPaymentOrder(bookingId);
      
      // Redirect đến Zalopay
      if (result.order_url) {
        window.location.href = result.order_url;
      } else {
        setError('Không thể tạo đơn thanh toán');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đơn thanh toán');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-900 dark:text-white">Đang tải...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 dark:text-red-400">{error || 'Không tìm thấy đơn đặt vé'}</div>
        <button
          onClick={() => navigate('/movies')}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  const totalPrice = booking.totalPrice;
  const seatList = booking.seat.map(s => `${s.row}-${s.number}`).join(', ');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <div className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-[#324467] rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Thanh toán</h1>

        {/* Thông tin đơn hàng */}
        <div className="bg-gray-100 dark:bg-[#232f48] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông tin đơn hàng</h2>
          
          <div className="space-y-3 text-gray-600 dark:text-text-secondary">
            <div>
              <span className="font-medium">Phim:</span>
              <span className="text-gray-900 dark:text-white ml-2">{booking.showtime.movie.title}</span>
            </div>
            <div>
              <span className="font-medium">Rạp:</span>
              <span className="text-gray-900 dark:text-white ml-2">{booking.showtime.cinema.name}</span>
            </div>
            <div>
              <span className="font-medium">Địa chỉ:</span>
              <span className="text-gray-900 dark:text-white ml-2">{booking.showtime.cinema.address}</span>
            </div>
            <div>
              <span className="font-medium">Suất chiếu:</span>
              <span className="text-gray-900 dark:text-white ml-2">
                {new Date(booking.showtime.startTime).toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className="font-medium">Ghế:</span>
              <span className="text-gray-900 dark:text-white ml-2">{seatList}</span>
            </div>
            <div>
              <span className="font-medium">Số lượng:</span>
              <span className="text-gray-900 dark:text-white ml-2">{booking.seat.length} vé</span>
            </div>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="bg-gray-100 dark:bg-[#232f48] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Tổng tiền:</span>
            <span className="text-3xl font-bold text-primary">
              {totalPrice.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-400">
            {error}
          </div>
        )}

        {/* Phương thức thanh toán */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Phương thức thanh toán</h3>
          <div className="bg-gray-100 dark:bg-[#232f48] rounded-lg p-4 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-primary" />
            <span className="text-gray-900 dark:text-white">Ví điện tử ZaloPay</span>
          </div>
        </div>

        {/* Lưu ý */}
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-start gap-2">
          <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="text-yellow-400 text-sm">
            <p className="font-bold mb-1">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Bạn có 5 phút để hoàn tất thanh toán</li>
              <li>Sau khi thanh toán thành công, vé sẽ được gửi đến email của bạn</li>
              <li>Vui lòng đến rạp đúng giờ với mã QR trên vé</li>
            </ul>
          </div>
        </div>

        {/* Nút thanh toán */}
        <button
          onClick={handlePayment}
          disabled={processing || booking.status !== 'pending'}
          className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Thanh toán qua ZaloPay
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;

