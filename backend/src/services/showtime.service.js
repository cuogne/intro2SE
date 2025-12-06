const Showtime = require('../models/showtime.model');

const getAllShowtimes = async () => {
  const showtimes = await Showtime.find()
    .populate('movie', 'title posterImg minutes') // movie id -> movie object (title posterImg minutes)
    .populate('cinema', 'name address')           // cinema id -> cinema object (name address)
    .select('-seats')
    .sort({ startTime: 1 });
    
  return showtimes;
};

module.exports = {
  getAllShowtimes,
};