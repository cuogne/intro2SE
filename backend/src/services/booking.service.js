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

const addBooking = async (userId, showtimeId, seats) => {
  // Validate showtime exists
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    throw new Error('Showtime not found');
  }

  const existingBookings = await Booking.find({ showtime: showtimeId });
  const bookedSeats = existingBookings.flatMap((b) =>
    b.seat.map((s) => `${s.row}-${s.number}`)
  );

  const requestedSeats = seats.map((s) => `${s.row}-${s.number}`);
  const alreadyBooked = requestedSeats.filter((s) =>
    bookedSeats.includes(s)
  );

  if (alreadyBooked.length > 0) {
    throw new Error(`Seats already booked: ${alreadyBooked.join(', ')}`);
  }

  const totalPrice = showtime.price * seats.length;

  seats.forEach(seat => {
    const seatIndex = showtime.seats.findIndex(
      s => s.row === seat.row && s.number === seat.number
    );
    if (seatIndex !== -1) {
      showtime.seats[seatIndex].isBooked = true;
    }
  });

  showtime.availableSeats -= seats.length;
  await showtime.save();

  // Create booking
  const booking = new Booking({
    user: userId,
    showtime: showtimeId,
    seat: seats,
    totalPrice,
    status: 'pending', // default
    bookedAt: new Date(),
  });

  await booking.save();

  return booking;
};

module.exports = {
  getBookingById,
  getBookingByUser,
  addBooking,
};
