const Showtime = require('../models/showtime.model')

const getShowtimes = async (movie, date, cinema) => {
  const filter = {}

    if (movie) filter.movie = movie
    if (cinema) filter.cinema = cinema
    if (date) {
        const start = new Date(date)
        start.setHours(0,0,0,0)
        const end = new Date(date)
        end.setHours(23,59,59,999)
        filter.startTime = { $gte: start, $lte: end }
    }

    const result = await Showtime.find(filter)
        .populate('movie', 'title')
        .populate('cinema', 'name')
        .select('-seats')

    return result
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
  getShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime
}