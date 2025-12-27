const Showtime = require('../models/showtime.model')
const Cinema = require('../models/cinema.model') // thêm dòng này
const Booking = require('../models/booking.model')

const getShowtimesByQuery = async (movie, date, cinema, page = 1, limit = 10) => {
  const filter = {}

  if (movie) filter.movie = movie
  if (cinema) filter.cinema = cinema
  if (date) {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    filter.startTime = { $gte: start, $lte: end }
  }

  const skip = (page - 1) * limit;

  const [docs, totalDocs] = await Promise.all([
    Showtime.find(filter)
      .select('startTime price totalSeats availableSeats movie cinema')
      .populate('movie', 'title minutes posterImg status')
      .populate('cinema', 'name address')
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Showtime.countDocuments(filter)
  ]);

  return {
    docs,
    totalDocs,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(totalDocs / limit)
  }
}

const getShowtimeById = async (id) => {
  const showtime = await Showtime.findById(id)
    .populate('movie')
    .populate('cinema');

  if (!showtime) {
    return null;
  }

  // Lấy tất cả booking active (confirmed hoặc pending còn hiệu lực)
  const now = new Date();
  const activeBookings = await Booking.find({
    showtime: id,
    $or: [
      { status: 'confirmed' },
      {
        status: 'pending',
        holdExpiresAt: { $gt: now } // Chỉ tính booking pending còn hiệu lực
      }
    ]
  });

  // Tạo map để đánh dấu ghế đã được book/reserve
  const seatStatusMap = new Map();

  // Đánh dấu ghế confirmed (đã thanh toán)
  activeBookings
    .filter(b => b.status === 'confirmed')
    .forEach(booking => {
      booking.seat.forEach(seat => {
        const key = `${seat.row}-${seat.number}`;
        seatStatusMap.set(key, 'booked');
      });
    });

  // Đánh dấu ghế pending (đang giữ)
  activeBookings
    .filter(b => b.status === 'pending' && b.holdExpiresAt > now)
    .forEach(booking => {
      booking.seat.forEach(seat => {
        const key = `${seat.row}-${seat.number}`;
        if (!seatStatusMap.has(key)) {
          seatStatusMap.set(key, 'reserved');
        }
      });
    });

  // cap nhat trang thai ghe trong showtime
  const seatsWithStatus = showtime.seats.map(seat => {
    const key = `${seat.row}-${seat.number}`;
    const status = seatStatusMap.get(key) || 'available';

    return {
      ...seat.toObject ? seat.toObject() : seat,
      status: status, // 'available', 'reserved', 'booked'
      isBooked: status === 'booked' || status === 'reserved'
    };
  });

  const showtimeObj = showtime.toObject ? showtime.toObject() : showtime;
  showtimeObj.seats = seatsWithStatus;

  return showtimeObj;
};

const createShowtime = async (showtimeData) => {
  const { movie, cinema, startTime, price } = showtimeData

  const cinemaDoc = await Cinema.findById(cinema).select('seatLayout')
  if (!cinemaDoc) {
    throw new Error('Cinema not found')
  }
  if (!cinemaDoc.seatLayout || cinemaDoc.seatLayout.length === 0) {
    throw new Error('Cinema has no seat layout')
  }

  // chuyển seatLayout => seats của showtime
  // seatLayout: [{ row: 'A', seats: ["A1", "A2", "A3"] }, ...]
  // Parse từ format "A1" -> { row: "A", number: 1 }
  const seats = []
  cinemaDoc.seatLayout.forEach(rowLayout => {
    rowLayout.seats.forEach(seatString => {
      const number = parseInt(seatString.replace(rowLayout.row, ''))
      if (!isNaN(number)) {
        seats.push({
          row: rowLayout.row,
          number: number,
          // isBooked dùng default: false
        })
      }
    })
  })

  const totalSeats = seats.length

  const showtimeObj = {
    movie,
    cinema,
    startTime,
    totalSeats,
    availableSeats: totalSeats,
    seats
  }

  // Only include price if provided, otherwise use model default
  if (price !== undefined) {
    showtimeObj.price = price
  }

  const showtime = new Showtime(showtimeObj)

  return await showtime.save()
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
  deleteShowtime
}