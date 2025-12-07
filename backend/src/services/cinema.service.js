const Cinema = require('../models/cinema.model');

const getAllCinemas = async () => {
  return await Cinema.find({});
};

const getCinemaById = async (id) => {
  return await Cinema.findById(id).lean();
};

const createCinema = async (cinemaData) => {
  const cinema = new Cinema(cinemaData);
  return await cinema.save();
};

const updateCinema = async (id, cinemaData) => {
  return await Cinema.findByIdAndUpdate(id, cinemaData, {
    new: true,
    runValidators: true,
  });
};

const deleteCinema = async (id) => {
  return await Cinema.findByIdAndDelete(id);
};

module.exports = {
  getAllCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
};
