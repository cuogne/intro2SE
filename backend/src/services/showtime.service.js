const Showtime = require('../models/showtime.model')

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
      .populate('movie', 'title durationMinutes posterImg status')
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
  return await Showtime.findById(id)
    .populate('movie')
    .populate('cinema');
};

const createShowtime = async (showtimeData) => {
  const showtime = new Showtime(showtimeData);
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
  deleteShowtime
}