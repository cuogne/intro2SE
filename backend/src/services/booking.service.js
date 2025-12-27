const Booking = require('../models/booking.model');
const Showtime = require('../models/showtime.model');
const mongoose = require('mongoose');

// GET /api/v1/bookings
const getBookingByUser = async (userId) => {
  return await Booking.find({ user: userId })
    .select('showtime user seat price bookedAt')
    .populate('user', 'username')
    .populate({
      path: 'showtime',
      select: 'movie cinema startTime price',
      populate: [
        {
          path: 'movie',
          select: 'title minutes',
        },
        {
          path: 'cinema',
          select: 'name address',
        }
      ]
    })
    .sort({ bookedAt: -1 });
};

// GET /api/v1/bookings/:id
const getBookingById = async (bookingId, currentUserId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: currentUserId
  })
    .populate('user', 'username')
    .populate({
      path: 'showtime',
      select: 'startTime totalPrice',
      populate: [
        { path: 'movie', select: 'title minutes' },
        { path: 'cinema', select: 'name address' }
      ]
    });

  if (!booking) throw new Error('Booking not found');

  // 1 cai ve
  /*
  user: cuogne
  movie: Avatar 3
  minutes: 192 phut
  cinema: Cinestar Sinh Vien
  address: Lang Dai Hoc
  startTime: 2025-12-18 14:55
  price: 45000
  seat: A-5, A-6
  quantity: 2
  bookedAt: 2025-12-14 10:30
  */

  const bookData = {
    id: booking._id,
    user: booking.user.username,
    movie: booking.showtime.movie.title,
    cinema: booking.showtime.cinema.name,
    address: booking.showtime.cinema.address,
    startTime: booking.showtime.startTime,
    totalPrice: booking.totalPrice,
    seat: booking.seat.map(s => `${s.row} - ${s.number}`),
    quantity: booking.seat.length,
    bookedAt: booking.bookedAt,
  }

  return bookData
}

// Hàm kiểm tra ghế có available không (bao gồm cả booking pending còn hiệu lực)
const checkSeatsAvailable = async (showtimeId, seats) => {
  const now = new Date();

  // Lấy tất cả booking của showtime này (confirmed hoặc pending còn hiệu lực)
  const activeBookings = await Booking.find({
    showtime: showtimeId,
    $or: [
      { status: 'confirmed' },
      {
        status: 'pending',
        holdExpiresAt: { $gt: now } // Chỉ tính booking pending còn hiệu lực
      }
    ]
  });

  const bookedSeats = activeBookings.flatMap((b) =>
    b.seat.map((s) => `${s.row}-${s.number}`)
  );

  const requestedSeats = seats.map((s) => `${s.row}-${s.number}`);
  const alreadyBooked = requestedSeats.filter((s) =>
    bookedSeats.includes(s)
  );

  return {
    available: alreadyBooked.length === 0,
    conflictSeats: alreadyBooked
  };
};

// Giữ ghế 5 phút (tạo booking pending với holdExpiresAt)
const reserveSeats = async (userId, showtimeId, seats) => {
  // Validate showtime exists
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    throw new Error('Showtime not found');
  }

  // Kiểm tra ghế có available không
  const seatCheck = await checkSeatsAvailable(showtimeId, seats);
  if (!seatCheck.available) {
    throw new Error(`Seats already booked or reserved: ${seatCheck.conflictSeats.join(', ')}`);
  }

  const totalPrice = showtime.price * seats.length;
  const now = new Date();
  const holdExpiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 phút

  // Tạo booking với status pending và holdExpiresAt
  const booking = new Booking({
    user: userId,
    showtime: showtimeId,
    seat: seats,
    totalPrice,
    status: 'pending',
    holdExpiresAt: holdExpiresAt,
    bookedAt: now,
  });

  await booking.save();

  return {
    booking,
    holdExpiresAt,
    expiresInSeconds: 300 // 5 phút = 300 giây
  };
};

// Tạo booking từ reservation (khi user ấn thanh toán)
const addBooking = async (userId, showtimeId, seats) => {
  // Validate showtime exists
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    throw new Error('Showtime not found');
  }

  // Kiểm tra ghế có available không
  const seatCheck = await checkSeatsAvailable(showtimeId, seats);
  if (!seatCheck.available) {
    throw new Error(`Seats already booked or reserved: ${seatCheck.conflictSeats.join(', ')}`);
  }

  const totalPrice = showtime.price * seats.length;
  const now = new Date();
  const holdExpiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 phút

  // Create booking
  const booking = new Booking({
    user: userId,
    showtime: showtimeId,
    seat: seats,
    totalPrice,
    status: 'pending', // default
    holdExpiresAt: holdExpiresAt,
    bookedAt: now,
  });

  await booking.save();

  return booking;
};

const cleanupExpiredBookings = async () => {
  const now = new Date();

  // Tìm tất cả booking pending đã hết hạn
  const expiredBookings = await Booking.find({
    status: 'pending',
    holdExpiresAt: { $lte: now }
  }).populate('showtime');

  let cleanedCount = 0;

  for (const booking of expiredBookings) {
    // Xóa booking khỏi database
    await Booking.findByIdAndDelete(booking._id);

    // Giải phóng ghế trong showtime (nếu showtime còn tồn tại)
    if (booking.showtime) {
      const showtime = booking.showtime;

      // Đánh dấu ghế là available lại
      booking.seat.forEach(seat => {
        const seatIndex = showtime.seats.findIndex(
          s => s.row === seat.row && s.number === seat.number
        );
        if (seatIndex !== -1) {
          showtime.seats[seatIndex].isBooked = false;
        }
      });

      // Recalculate availableSeats based on current seats state to ensure accuracy
      const actualAvailableSeats = showtime.seats.filter(s => !s.isBooked).length;
      showtime.availableSeats = actualAvailableSeats;

      await showtime.save();
    }

    cleanedCount++;
  }

  return cleanedCount;
};

module.exports = {
  getBookingById,
  getBookingByUser,
  addBooking,
  reserveSeats,
  checkSeatsAvailable,
  cleanupExpiredBookings,
};
