const Booking = require('../models/booking.model');
const Showtime = require('../models/showtime.model');
const mongoose = require('mongoose');

// GET /api/v1/bookings/me
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
    status: booking.status,
    bookedAt: booking.bookedAt,
    paidAt: booking.paidAt || null,
    paymentProvider: booking.paymentProvider || null,
    paymentTransId: booking.paymentTransId || null,
    paymentMeta: booking.paymentMeta || null,
  }

  return bookData
}

// check ghe available
const checkSeatsAvailable = async (showtimeId, seats) => {
  const now = new Date();

  const activeBookings = await Booking.find({
    showtime: showtimeId,
    $or: [
      { status: 'confirmed' },
      {
        status: 'pending',
        holdExpiresAt: { $gt: now }
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

// POST /api/v1/bookings
const reserveSeats = async (userId, showtimeId, seats) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const showtime = await Showtime.findById(showtimeId).session(session);
    if (!showtime) {
      await session.abortTransaction();
      throw new Error('Showtime not found');
    }

    const now = new Date();

    const existingBooking = await Booking.findOne({
      user: userId,
      showtime: showtimeId,
      status: 'pending',
      holdExpiresAt: { $gt: now }
    }).session(session);

    if (existingBooking) {
      const activeBookings = await Booking.find({
        showtime: showtimeId,
        _id: { $ne: existingBooking._id },
        $or: [
          { status: 'confirmed' },
          {
            status: 'pending',
            holdExpiresAt: { $gt: now }
          }
        ]
      }).session(session);

      const bookedSeats = new Set(
        activeBookings.flatMap(b => b.seat.map(s => `${s.row}-${s.number}`))
      );

      const conflictSeats = seats.filter(s => {
        const seatKey = `${s.row}-${s.number}`;

        if (bookedSeats.has(seatKey)) return true;

        return existingBooking.seat.some(
          es => es.row === s.row && es.number === s.number
        );
      });

      if (conflictSeats.length > 0) {
        await session.abortTransaction();
        throw new Error(
          `Seats already booked or in reservation: ${conflictSeats.map(s => `${s.row}-${s.number}`).join(', ')}`
        );
      }

      existingBooking.seat.push(...seats);
      existingBooking.totalPrice = showtime.price * existingBooking.seat.length;

      await existingBooking.save({ session });
      await session.commitTransaction();

      const remainingSeconds = Math.floor(
        (existingBooking.holdExpiresAt.getTime() - now.getTime()) / 1000
      );

      return {
        booking: existingBooking,
        holdExpiresAt: existingBooking.holdExpiresAt,
        expiresInSeconds: remainingSeconds,
        isNewBooking: false
      };
    } else {
      const seatCheck = await checkSeatsAvailable(showtimeId, seats);
      if (!seatCheck.available) {
        await session.abortTransaction();
        throw new Error(
          `Seats already booked or reserved: ${seatCheck.conflictSeats.join(', ')}`
        );
      }

      const totalPrice = showtime.price * seats.length;
      const holdExpiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 phút

      // Tạo booking mới
      const booking = new Booking({
        user: userId,
        showtime: showtimeId,
        seat: seats,
        totalPrice,
        status: 'pending',
        holdExpiresAt: holdExpiresAt,
        bookedAt: now,
      });

      await booking.save({ session });
      await session.commitTransaction();

      return {
        booking,
        holdExpiresAt,
        expiresInSeconds: 300,
        isNewBooking: true
      };
    }
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// them ghe
const updateBookingSeats = async (userId, bookingId, action, seats) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let transactionCommitted = false;

  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
      status: 'pending'
    }).session(session);

    if (!booking) {
      await session.abortTransaction();
      throw new Error('Booking not found or not authorized');
    }

    const now = new Date();
    if (booking.holdExpiresAt <= now) {
      await session.abortTransaction();
      throw new Error('Booking has expired');
    }

    const showtime = await Showtime.findById(booking.showtime).session(session);
    if (!showtime) {
      await session.abortTransaction();
      throw new Error('Showtime not found');
    }

    if (action === 'add') {
      const existingSeats = booking.seat.map(s => `${s.row}-${s.number}`);
      const duplicates = seats.filter(s => existingSeats.includes(`${s.row}-${s.number}`));

      if (duplicates.length > 0) {
        await session.abortTransaction();
        throw new Error(`Seats already in reservation: ${duplicates.map(s => `${s.row}-${s.number}`).join(', ')}`);
      }

      const seatQueries = seats.map(s => ({ 'seat.row': s.row, 'seat.number': s.number }));

      const activeBookings = await Booking.find({
        showtime: booking.showtime,
        _id: { $ne: bookingId }, // Exclude booking hiện tại
        $or: [
          { status: 'confirmed' },
          {
            status: 'pending',
            holdExpiresAt: { $gt: now }
          }
        ],
        $or: seatQueries // Match any of the requested seats
      }).session(session);

      if (activeBookings.length > 0) {
        const bookedSeatKeys = activeBookings.flatMap(b => b.seat.map(s => `${s.row}-${s.number}`));
        const conflicts = seats.filter(s => bookedSeatKeys.includes(`${s.row}-${s.number}`));

        if (conflicts.length > 0) {
          await session.abortTransaction();
          throw new Error(`Seats already booked or reserved: ${conflicts.map(s => `${s.row}-${s.number}`).join(', ')}`);
        }
      }

      booking.seat.push(...seats);

    } else if (action === 'remove') {
      const initialLength = booking.seat.length;

      // Filter out seats that match any in the remove list
      const seatsToRemoveKeys = seats.map(s => `${s.row}-${s.number}`);
      booking.seat = booking.seat.filter(
        s => !seatsToRemoveKeys.includes(`${s.row}-${s.number}`)
      );

      if (booking.seat.length === initialLength) {
        await session.abortTransaction();
        throw new Error('None of the requested seats were found in reservation');
      }

      if (booking.seat.length === 0) {
        await Booking.findByIdAndDelete(bookingId).session(session);
        await session.commitTransaction();
        transactionCommitted = true;
        return { deleted: true, booking: null, holdExpiresAt: null };
      }
    } else {
      await session.abortTransaction();
      throw new Error('Invalid action. Use "add" or "remove"');
    }

    booking.totalPrice = showtime.price * booking.seat.length;

    await booking.save({ session });
    await session.commitTransaction();
    transactionCommitted = true;

    const remainingSeconds = Math.floor((booking.holdExpiresAt.getTime() - now.getTime()) / 1000);

    return {
      booking,
      holdExpiresAt: booking.holdExpiresAt, // Giữ nguyên timer ban đầu
      expiresInSeconds: remainingSeconds,
      deleted: false
    };

  } catch (error) {
    // Chỉ abort transaction nếu chưa được commit
    if (!transactionCommitted) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        // Ignore nếu transaction đã được abort hoặc commit
        console.log('Transaction abort failed (safely ignored):', abortError.message);
      }
    }
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate('user', 'username')
    .populate({
      path: 'showtime',
      select: 'startTime totalPrice',
      populate: [
        { path: 'movie', select: 'title minutes' },
        { path: 'cinema', select: 'name address' }
      ]
    })
    .sort({ bookedAt: -1 });

  return bookings.map(booking => ({
    id: booking._id,
    user: booking.user?.username || null,
    movie: booking.showtime?.movie?.title || null,
    cinema: booking.showtime?.cinema?.name || null,
    address: booking.showtime?.cinema?.address || null,
    startTime: booking.showtime?.startTime || null,
    totalPrice: booking.totalPrice,
    seat: booking.seat.map(s => `${s.row} - ${s.number}`),
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
            $lte: new Date(toDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);
    return result.length > 0 ? result[0].totalRevenue : 0;
  }
  catch (error) {
    throw new Error('Error calculating total revenue');
  }
}

const getBookingStatistics = async (fromDate, toDate, movieId, cinemaId) => {
  try {
    // Build match conditions
    const matchConditions = {
      status: 'confirmed',
      paidAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      }
    };

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'showtimes',
          localField: 'showtime',
          foreignField: '_id',
          as: 'showtimeData'
        }
      },
      { $unwind: '$showtimeData' }
    ];

    // Add movie filter if provided
    if (movieId) {
      pipeline.push({
        $match: {
          'showtimeData.movie': new mongoose.Types.ObjectId(movieId)
        }
      });
    }

    // Add cinema filter if provided
    if (cinemaId) {
      pipeline.push({
        $match: {
          'showtimeData.cinema': new mongoose.Types.ObjectId(cinemaId)
        }
      });
    }

    // Lookup movie and cinema data
    pipeline.push(
      {
        $lookup: {
          from: 'movies',
          localField: 'showtimeData.movie',
          foreignField: '_id',
          as: 'movieData'
        }
      },
      { $unwind: '$movieData' },
      {
        $lookup: {
          from: 'cinemas',
          localField: 'showtimeData.cinema',
          foreignField: '_id',
          as: 'cinemaData'
        }
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
          totalTickets: { $sum: { $size: '$seat' } }
        }
      }
    ];

    // Calculate by movie
    const movieStatsPipeline = [
      ...pipeline,
      {
        $group: {
          _id: {
            movieId: '$showtimeData.movie',
            movieTitle: '$movieData.title'
          },
          revenue: { $sum: '$totalPrice' },
          tickets: { $sum: { $size: '$seat' } },
          bookings: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          movieId: '$_id.movieId',
          movieTitle: '$_id.movieTitle',
          revenue: 1,
          tickets: 1,
          bookings: 1
        }
      },
      { $sort: { revenue: -1 } }
    ];

    // Calculate by cinema
    const cinemaStatsPipeline = [
      ...pipeline,
      {
        $group: {
          _id: {
            cinemaId: '$showtimeData.cinema',
            cinemaName: '$cinemaData.name'
          },
          revenue: { $sum: '$totalPrice' },
          tickets: { $sum: { $size: '$seat' } },
          bookings: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          cinemaId: '$_id.cinemaId',
          cinemaName: '$_id.cinemaName',
          revenue: 1,
          tickets: 1,
          bookings: 1
        }
      },
      { $sort: { revenue: -1 } }
    ];

    // Execute all pipelines in parallel
    const [totalStats, byMovie, byCinema] = await Promise.all([
      Booking.aggregate(totalStatsPipeline),
      Booking.aggregate(movieStatsPipeline),
      Booking.aggregate(cinemaStatsPipeline)
    ]);

    const stats = totalStats.length > 0 ? totalStats[0] : {
      totalRevenue: 0,
      totalBookings: 0,
      totalTickets: 0
    };

    // Get all bookings matching the filters
    const bookingQuery = { status: 'confirmed', paidAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } };
    const bookings = await Booking.find(bookingQuery)
      .populate('user', 'username')
      .populate({
        path: 'showtime',
        select: 'startTime totalPrice movie cinema',
        populate: [
          { path: 'movie', select: 'title minutes' },
          { path: 'cinema', select: 'name address' }
        ]
      })
      .sort({ bookedAt: -1 });

    // Filter by movie and cinema if specified
    let filteredBookings = bookings;
    if (movieId) {
      filteredBookings = filteredBookings.filter(b => b.showtime?.movie?._id?.toString() === movieId);
    }
    if (cinemaId) {
      filteredBookings = filteredBookings.filter(b => b.showtime?.cinema?._id?.toString() === cinemaId);
    }

    const transactionsList = filteredBookings.map(booking => ({
      id: booking._id,
      user: booking.user?.username || null,
      movie: booking.showtime?.movie?.title || null,
      cinema: booking.showtime?.cinema?.name || null,
      address: booking.showtime?.cinema?.address || null,
      startTime: booking.showtime?.startTime || null,
      totalPrice: booking.totalPrice,
      seat: booking.seat.map(s => `${s.row} - ${s.number}`),
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
      transactions: transactionsList
    };
  } catch (error) {
    throw new Error('Error calculating booking statistics: ' + error.message);
  }
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
  reserveSeats,
  updateBookingSeats,
  checkSeatsAvailable,
  getAllBookings,
  getTotalRevenue,
  getBookingStatistics,
  cleanupExpiredBookings,
};
