import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookingById, type Booking } from '../services/bookingService';
import { ArrowLeft, Download, QrCode } from 'lucide-react';

const TicketPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!bookingId) {
      navigate('/bookings');
      return;
    }

    const loadBooking = async () => {
      setLoading(true);
      try {
        const data = await getBookingById(bookingId);
        if (data) {
          if (data.status !== 'confirmed') {
            navigate('/bookings');
            return;
          }
          setBooking(data);
          // Tạo QR code từ booking ID (có thể dùng thư viện qrcode sau)
          setQrCode(`BOOKING-${bookingId}`);
        }
      } catch (error) {
        console.error('Error loading booking:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, user, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Tạo PDF hoặc download vé (có thể implement sau)
    alert('Tính năng tải vé sẽ được cập nhật sớm');
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
        <div className="text-center text-red-500 dark:text-red-400">Không tìm thấy vé</div>
        <button
          onClick={() => navigate('/bookings')}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Về lịch sử đặt vé
        </button>
      </div>
    );
  }

  const seatList = booking.seat.map(s => `${s.row}-${s.number}`).join(', ');
  const showtimeDate = new Date(booking.showtime.startTime);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/bookings')}
          className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#232f48] text-white rounded-lg hover:bg-[#324467] transition-colors"
          >
            <Download className="w-4 h-4" />
            Tải vé
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold"
          >
            In vé
          </button>
        </div>
      </div>

      {/* Vé điện tử */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1a2332] dark:to-[#232f48] rounded-xl p-8 shadow-2xl border border-gray-200 dark:border-primary/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">ABC CINEMA</h1>
          <p className="text-gray-600 dark:text-text-secondary">Vé điện tử</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
              <div className="text-center">
                <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-mono">{qrCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin vé */}
        <div className="bg-gray-100 dark:bg-[#232f48]/50 rounded-lg p-6 space-y-4 mb-6">
          <div>
            <p className="text-gray-600 dark:text-text-secondary text-sm mb-1">Phim</p>
            <p className="text-gray-900 dark:text-white text-xl font-bold">{booking.showtime.movie.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-text-secondary text-sm mb-1">Rạp</p>
              <p className="text-gray-900 dark:text-white font-medium">{booking.showtime.cinema.name}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-text-secondary text-sm mb-1">Địa chỉ</p>
              <p className="text-gray-900 dark:text-white font-medium text-sm">{booking.showtime.cinema.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-text-secondary text-sm mb-1">Ngày chiếu</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {showtimeDate.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-text-secondary text-sm mb-1">Giờ chiếu</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {showtimeDate.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-text-secondary text-sm mb-1">Ghế</p>
              <p className="text-gray-900 dark:text-white font-medium">{seatList}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-text-secondary text-sm mb-1">Số lượng</p>
              <p className="text-gray-900 dark:text-white font-medium">{booking.seat.length} vé</p>
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-[#232f48] pt-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 dark:text-text-secondary">Tổng tiền</p>
              <p className="text-primary text-2xl font-bold">
                {booking.totalPrice.toLocaleString('vi-VN')} đ
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-text-secondary text-sm space-y-2">
          <p>Mã đặt vé: <span className="font-mono text-gray-900 dark:text-white">{booking._id}</span></p>
          {booking.paidAt && (
            <p>Thanh toán: {new Date(booking.paidAt).toLocaleString('vi-VN')}</p>
          )}
          <p className="mt-4 text-xs">
            Vui lòng đến rạp đúng giờ và trình mã QR để vào xem phim
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;

