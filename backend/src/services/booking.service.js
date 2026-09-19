const Booking = require('../models/booking.model');
const Showtime = require('../models/showtime.model');
const Movie = require('../models/movie.model');
const Cinema = require('../models/cinema.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const seatHold = require('./seatHold.service');

// GET /api/v1/bookings/me
const getBookingByUser = async (userId) => {
  const bookings = await Booking.find({ user: userId, status: { $ne: 'expired' } })
    .select('showtime user seat totalPrice status bookedAt paidAt paymentProvider paymentTransId paymentMeta')
    .populate('user', 'username')
    .populate({
      path: 'showtime',
      select: 'movie cinema startTime',
      populate: [
        {
          path: 'movie',
          select: 'title',
        },
        {
          path: 'cinema',
          select: 'name address',
        },
      ],
    })
    .sort({ bookedAt: -1 })
    .lean();

  return bookings
    .filter((booking) => booking.showtime?.movie && booking.showtime?.cinema)
    .map((booking) => ({
      id: booking._id,
      user: booking.user?.username || '',
      movie: booking.showtime.movie.title,
      cinema: booking.showtime.cinema.name,
      address: booking.showtime.cinema.address || '',
      startTime: booking.showtime.startTime,
      totalPrice: booking.totalPrice,
      seat: booking.seat.map((seat) => `${seat.row}${seat.number}`),
      quantity: booking.seat.length,
      status: booking.status,
      bookedAt: booking.bookedAt,
      paidAt: booking.paidAt || null,
      paymentProvider: booking.paymentProvider || null,
      paymentTransId: booking.paymentTransId || null,
      paymentMeta: booking.paymentMeta || null,
    }));
};

// GET /api/v1/bookings/:id
const getBookingById = async (bookingId, currentUserId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: currentUserId,
  })
    .populate('user', 'username')
    .populate({
      path: 'showtime',
      select: 'startTime totalPrice',
      populate: [
        { path: 'movie', select: 'title minutes' },
        { path: 'cinema', select: 'name address' },
      ],
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
    seat: booking.seat.map((s) => `${s.row}${s.number}`),
    quantity: booking.seat.length,
    status: booking.status,
    bookedAt: booking.bookedAt,
    paidAt: booking.paidAt || null,
    paymentProvider: booking.paymentProvider || null,
    paymentTransId: booking.paymentTransId || null,
    paymentMeta: booking.paymentMeta || null,
  };

  return bookData;
};

const checkSeatsAvailable = async (showtimeId, seats, excludeUserId = null) => {
  await cleanupExpiredBookings(showtimeId);

  const now = new Date();

  const confirmedBookings = await Booking.find({
    showtime: showtimeId,
    status: 'confirmed',
  });

  const excludeUserIdStr = excludeUserId ? String(excludeUserId) : null;
  const activePendingBookings = await Booking.find({
    showtime: showtimeId,
    status: 'pending',
    holdExpiresAt: { $gt: now },
  });

  const bookedSeats = new Set();

  confirmedBookings.forEach((b) => {
    b.seat.forEach((s) => bookedSeats.add(`${s.row}-${s.number}`));
  });

  activePendingBookings.forEach((b) => {
    if (String(b.user) !== excludeUserIdStr) {
      b.seat.forEach((s) => bookedSeats.add(`${s.row}-${s.number}`));
    }
  });

  const heldSeats = await seatHold.getHeldSeatsForShowtime(showtimeId);

  const requestedSeats = seats.map((s) => ({ key: `${s.row}-${s.number}`, seat: s }));
  const conflicts = requestedSeats.filter(({ key }) => {
    if (bookedSeats.has(key)) return true;
    if (heldSeats[key] && String(heldSeats[key]) !== excludeUserIdStr) return true;
    return false;
  });

  return {
    available: conflicts.length === 0,
    conflictSeats: conflicts.map((c) => c.key),
  };
};

const reserveSeats = async (userId, showtimeId, seats) => {
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    throw new Error('Showtime not found');
  }

  const now = new Date();

  const existingBooking = await Booking.findOne({
    user: userId,
    showtime: showtimeId,
    status: 'pending',
    holdExpiresAt: { $gt: now },
  });

  if (existingBooking) {
    const existingSeats = new Set(existingBooking.seat.map((s) => `${s.row}-${s.number}`));
    const newSeats = seats.filter((s) => !existingSeats.has(`${s.row}-${s.number}`));

    if (newSeats.length > 0) {
      const seatCheck = await checkSeatsAvailable(showtimeId, newSeats, userId);

      if (!seatCheck.available) {
        throw new Error(`Seats already booked or reserved: ${seatCheck.conflictSeats.join(', ')}`);
      }

      await Promise.all(
        newSeats.map((s) => seatHold.holdSeat(showtimeId, s.row, s.number, String(userId)))
      );

      existingBooking.seat.push(...newSeats);
    }

    existingBooking.totalPrice = showtime.price * existingBooking.seat.length;

    await existingBooking.save();
    await seatHold.refreshHold(showtimeId, String(userId));

    const remainingSeconds = Math.floor(
      (existingBooking.holdExpiresAt.getTime() - now.getTime()) / 1000
    );

    return {
      booking: existingBooking,
      holdExpiresAt: existingBooking.holdExpiresAt,
      expiresInSeconds: remainingSeconds,
      isNewBooking: false,
    };
  } else {
    const seatCheck = await checkSeatsAvailable(showtimeId, seats, userId);
    if (!seatCheck.available) {
      throw new Error(`Seats already booked or reserved: ${seatCheck.conflictSeats.join(', ')}`);
    }

    await Promise.all(
      seats.map((s) => seatHold.holdSeat(showtimeId, s.row, s.number, String(userId)))
    );

    const totalPrice = showtime.price * seats.length;
    const holdExpiresAt = new Date(now.getTime() + seatHold.HOLD_TTL * 1000);

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
      expiresInSeconds: seatHold.HOLD_TTL,
      isNewBooking: true,
    };
  }
};

const updateBookingSeats = async (userId, bookingId, action, seats) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
    status: 'pending',
  });

  if (!booking) {
    throw new Error('Booking not found or not authorized');
  }

  const now = new Date();
  if (booking.holdExpiresAt <= now) {
    await seatHold.releaseSeats(booking.showtime, booking.seat);
    await Booking.findByIdAndUpdate(bookingId, { status: 'expired' });
    throw new Error('Booking has expired');
  }

  const showtime = await Showtime.findById(booking.showtime);
  if (!showtime) {
    throw new Error('Showtime not found');
  }

  if (action === 'add') {
    const existingSeats = booking.seat.map((s) => `${s.row}-${s.number}`);
    const duplicates = seats.filter((s) => existingSeats.includes(`${s.row}-${s.number}`));

    if (duplicates.length > 0) {
      throw new Error(
        `Seats already in reservation: ${duplicates.map((s) => `${s.row}-${s.number}`).join(', ')}`
      );
    }

    const seatCheck = await checkSeatsAvailable(booking.showtime, seats, userId);

    if (!seatCheck.available) {
      throw new Error(`Seats already booked or reserved: ${seatCheck.conflictSeats.join(', ')}`);
    }

    await Promise.all(
      seats.map((s) => seatHold.holdSeat(booking.showtime, s.row, s.number, String(userId)))
    );

    booking.seat.push(...seats);
  } else if (action === 'remove') {
    const initialLength = booking.seat.length;

    const seatsToRemoveKeys = seats.map((s) => `${s.row}-${s.number}`);
    booking.seat = booking.seat.filter((s) => !seatsToRemoveKeys.includes(`${s.row}-${s.number}`));

    if (booking.seat.length === initialLength) {
      throw new Error('None of the requested seats were found in reservation');
    }

    await seatHold.releaseSeats(booking.showtime, seats);

    if (booking.seat.length === 0) {
      await Booking.findByIdAndDelete(bookingId);
      return { deleted: true, booking: null, holdExpiresAt: null };
    }
  } else {
    throw new Error('Invalid action. Use "add" or "remove"');
  }

  booking.totalPrice = showtime.price * booking.seat.length;
  await booking.save();

  await seatHold.refreshHold(String(booking.showtime), String(booking.user));

  const remainingSeconds = Math.floor((booking.holdExpiresAt.getTime() - now.getTime()) / 1000);

  return {
    booking,
    holdExpiresAt: booking.holdExpiresAt,
    expiresInSeconds: remainingSeconds,
    deleted: false,
  };
};

const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate('user', 'username')
    .populate({
      path: 'showtime',
      select: 'startTime totalPrice',
      populate: [
        { path: 'movie', select: 'title minutes' },
        { path: 'cinema', select: 'name address' },
      ],
    })
    .sort({ bookedAt: -1 });

  return bookings.map((booking) => ({
    id: booking._id,
    user: booking.user?.username || null,
    movie: booking.showtime?.movie?.title || null,
    cinema: booking.showtime?.cinema?.name || null,
    address: booking.showtime?.cinema?.address || null,
    startTime: booking.showtime?.startTime || null,
    totalPrice: booking.totalPrice,
    seat: booking.seat.map((s) => `${s.row} - ${s.number}`),
    quantity: booking.seat.length,
    status: booking.status,
    bookedAt: booking.bookedAt,
    paidAt: booking.paidAt || null,
    paymentProvider: booking.paymentProvider || null,
    paymentTransId: booking.paymentTransId || null,
    paymentMeta: booking.paymentMeta || null,
  }));
};

const getTotalRevenue = async (fromDate, toDate) => {
  try {
    const result = await Booking.aggregate([
      {
        $match: {
          status: 'confirmed',
          paidAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    return result.length > 0 ? result[0].totalRevenue : 0;
  } catch (error) {
    throw new Error('Error calculating total revenue');
  }
};

const getBookingStatistics = async (fromDate, toDate, movieId, cinemaId) => {
  try {
    // Build match conditions
    const matchConditions = {
      status: 'confirmed',
      paidAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    };

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'showtimes',
          localField: 'showtime',
          foreignField: '_id',
          as: 'showtimeData',
        },
      },
      { $unwind: '$showtimeData' },
    ];

    // Add movie filter if provided
    if (movieId) {
      pipeline.push({
        $match: {
          'showtimeData.movie': new mongoose.Types.ObjectId(movieId),
        },
      });
    }

    // Add cinema filter if provided
    if (cinemaId) {
      pipeline.push({
        $match: {
          'showtimeData.cinema': new mongoose.Types.ObjectId(cinemaId),
        },
      });
    }

    // Lookup movie and cinema data
    pipeline.push(
      {
        $lookup: {
          from: 'movies',
          localField: 'showtimeData.movie',
          foreignField: '_id',
          as: 'movieData',
        },
      },
      { $unwind: '$movieData' },
      {
        $lookup: {
          from: 'cinemas',
          localField: 'showtimeData.cinema',
          foreignField: '_id',
          as: 'cinemaData',
        },
      },
      { $unwind: '$cinemaData' }
    );

    // Calculate total statistics
    const totalStatsPipeline = [
      ...pipeline,
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 },
          totalTickets: { $sum: { $size: '$seat' } },
        },
      },
    ];

    // Calculate by movie
    const movieStatsPipeline = [
      ...pipeline,
      {
        $group: {
          _id: {
            movieId: '$showtimeData.movie',
            movieTitle: '$movieData.title',
          },
          revenue: { $sum: '$totalPrice' },
          tickets: { $sum: { $size: '$seat' } },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          movieId: '$_id.movieId',
          movieTitle: '$_id.movieTitle',
          revenue: 1,
          tickets: 1,
          bookings: 1,
        },
      },
      { $sort: { revenue: -1 } },
    ];

    // Calculate by cinema
    const cinemaStatsPipeline = [
      ...pipeline,
      {
        $group: {
          _id: {
            cinemaId: '$showtimeData.cinema',
            cinemaName: '$cinemaData.name',
          },
          revenue: { $sum: '$totalPrice' },
          tickets: { $sum: { $size: '$seat' } },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          cinemaId: '$_id.cinemaId',
          cinemaName: '$_id.cinemaName',
          revenue: 1,
          tickets: 1,
          bookings: 1,
        },
      },
      { $sort: { revenue: -1 } },
    ];

    // Execute all pipelines in parallel
    const [totalStats, byMovie, byCinema] = await Promise.all([
      Booking.aggregate(totalStatsPipeline),
      Booking.aggregate(movieStatsPipeline),
      Booking.aggregate(cinemaStatsPipeline),
    ]);

    const stats =
      totalStats.length > 0
        ? totalStats[0]
        : {
            totalRevenue: 0,
            totalBookings: 0,
            totalTickets: 0,
          };

    // Get all bookings matching the filters
    const bookingQuery = {
      status: 'confirmed',
      paidAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
    };
    const bookings = await Booking.find(bookingQuery)
      .populate('user', 'username')
      .populate({
        path: 'showtime',
        select: 'startTime totalPrice movie cinema',
        populate: [
          { path: 'movie', select: 'title minutes' },
          { path: 'cinema', select: 'name address' },
        ],
      })
      .sort({ bookedAt: -1 });

    // Filter by movie and cinema if specified
    let filteredBookings = bookings;
    if (movieId) {
      filteredBookings = filteredBookings.filter(
        (b) => b.showtime?.movie?._id?.toString() === movieId
      );
    }
    if (cinemaId) {
      filteredBookings = filteredBookings.filter(
        (b) => b.showtime?.cinema?._id?.toString() === cinemaId
      );
    }

    const transactionsList = filteredBookings.map((booking) => ({
      id: booking._id,
      user: booking.user?.username || null,
      movie: booking.showtime?.movie?.title || null,
      cinema: booking.showtime?.cinema?.name || null,
      address: booking.showtime?.cinema?.address || null,
      startTime: booking.showtime?.startTime || null,
      totalPrice: booking.totalPrice,
      seat: booking.seat.map((s) => `${s.row} - ${s.number}`),
      quantity: booking.seat.length,
      status: booking.status,
      bookedAt: booking.bookedAt,
      paidAt: booking.paidAt || null,
      paymentProvider: booking.paymentProvider || null,
      paymentTransId: booking.paymentTransId || null,
      paymentMeta: booking.paymentMeta || null,
    }));

    return {
      totalRevenue: stats.totalRevenue || 0,
      totalBookings: stats.totalBookings || 0,
      totalTickets: stats.totalTickets || 0,
      byMovie: byMovie || [],
      byCinema: byCinema || [],
      transactions: transactionsList,
    };
  } catch (error) {
    throw new Error('Error calculating booking statistics: ' + error.message);
  }
};

const cleanupExpiredBookings = async (showtimeId = null) => {
  const now = new Date();
  const filter = {
    status: 'pending',
    holdExpiresAt: { $lte: now },
  };
  if (showtimeId) filter.showtime = showtimeId;

  const expiredBookings = await Booking.find(filter);

  if (expiredBookings.length === 0) return 0;

  for (const booking of expiredBookings) {
    await seatHold.releaseSeats(booking.showtime, booking.seat);
    await Booking.findByIdAndUpdate(booking._id, { status: 'expired' });
  }

  return expiredBookings.length;
};

module.exports = {
  getBookingById,
  getBookingByUser,
  reserveSeats,
  updateBookingSeats,
  checkSeatsAvailable,
  getAllBookings,
  getTotalRevenue,
  getBookingStatistics,
  cleanupExpiredBookings,
};
