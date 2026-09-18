const Showtime = require('../models/showtime.model');
const Cinema = require('../models/cinema.model');
const Booking = require('../models/booking.model');
const seatHold = require('./seatHold.service');

const getShowtimesByQuery = async (movie, date, cinema, page = 1, limit = 10) => {
  const filter = {};

  if (movie) filter.movie = movie;
  if (cinema) filter.cinema = cinema;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.startTime = { $gte: start, $lte: end };
  }

  const skip = (page - 1) * limit;

  const [docs, totalDocs] = await Promise.all([
    Showtime.find(filter)
      .select('startTime endTime price totalSeats availableSeats movie cinema')
      .populate('movie', 'title minutes posterImg status')
      .populate('cinema', 'name address')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Showtime.countDocuments(filter),
  ]);

  return {
    docs,
    totalDocs,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(totalDocs / limit),
  };
};

const getShowtimeById = async (id, userId = null) => {
  const [showtime, confirmedBookings, userPendingBooking, heldSeats] = await Promise.all([
    Showtime.findById(id)
      .select('movie cinema startTime endTime price totalSeats availableSeats seats')
      .populate('movie', 'title minutes posterImg trailerLink description genre releaseDate status')
      .populate('cinema', 'name address')
      .lean(),
    Booking.find({ showtime: id, status: 'confirmed' }).select('seat').lean(),
    userId
      ? Booking.findOne({
          user: userId,
          showtime: id,
          status: 'pending',
          holdExpiresAt: { $gt: new Date() },
        })
          .select('seat holdExpiresAt')
          .lean()
      : null,
    seatHold.getHeldSeatsForShowtime(id).catch((error) => {
      console.error('Redis unavailable while loading held seats:', error.message);
      return {};
    }),
  ]);

  if (!showtime) {
    return null;
  }

  const seatStatusMap = new Map();

  confirmedBookings.forEach((booking) => {
    booking.seat.forEach((seat) => {
      const key = `${seat.row}-${seat.number}`;
      seatStatusMap.set(key, 'booked');
    });
  });

  const userIdStr = userId ? String(userId) : null;

  Object.entries(heldSeats).forEach(([key, holder]) => {
    if (!seatStatusMap.has(key)) {
      const isHeldByMe = Boolean(userIdStr && String(holder) === userIdStr);
      seatStatusMap.set(key, isHeldByMe ? 'held_by_me' : 'reserved');
    }
  });

  const seatsWithStatus = showtime.seats.map((seat) => {
    const key = `${seat.row}-${seat.number}`;
    const status = seatStatusMap.get(key) || 'available';

    return {
      ...(seat.toObject ? seat.toObject() : seat),
      status: status,
      isBooked: status === 'booked' || status === 'reserved',
    };
  });

  showtime.seats = seatsWithStatus;

  if (userPendingBooking) {
    showtime.pendingBooking = {
      bookingId: userPendingBooking._id,
      seats: userPendingBooking.seat,
      holdExpiresAt: userPendingBooking.holdExpiresAt,
    };
  }

  return showtime;
};

const createShowtime = async (showtimeData) => {
  const { movie, cinema, startTime, endTime, price } = showtimeData;

  const cinemaDoc = await Cinema.findById(cinema).select('seatLayout');
  if (!cinemaDoc) {
    throw new Error('Cinema not found');
  }
  if (!cinemaDoc.seatLayout || cinemaDoc.seatLayout.length === 0) {
    throw new Error('Cinema has no seat layout');
  }

  // chuyển seatLayout => seats của showtime
  // seatLayout: [{ row: 'A', seats: ["A1", "A2", "A3"] }, ...]
  // Parse từ format "A1" -> { row: "A", number: 1 }
  const seats = [];
  cinemaDoc.seatLayout.forEach((rowLayout) => {
    rowLayout.seats.forEach((seatString) => {
      const number = parseInt(seatString.replace(rowLayout.row, ''));
      if (!isNaN(number)) {
        seats.push({
          row: rowLayout.row,
          number: number,
          // isBooked dùng default: false
        });
      }
    });
  });

  const totalSeats = seats.length;

  const showtimeObj = {
    movie,
    cinema,
    startTime,
    endTime,
    totalSeats,
    availableSeats: totalSeats,
    seats,
  };

  // Only include price if provided, otherwise use model default
  if (price !== undefined) {
    showtimeObj.price = price;
  }

  const showtime = new Showtime(showtimeObj);

  return await showtime.save();
};

const updateShowtime = async (id, showtimeData) => {
  return await Showtime.findByIdAndUpdate(id, showtimeData, {
    new: true,
    runValidators: true,
  });
};

const deleteShowtime = async (id) => {
  return await Showtime.findByIdAndDelete(id);
};

module.exports = {
  getShowtimesByQuery,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};
