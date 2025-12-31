const Cinema = require('../models/cinema.model');
const { generateSeatLayout } = require('../utils/createSeatLayout');

const getAllCinemas = async () => {
  return await Cinema.find({});
};

const getCinemaById = async (id) => {
  return await Cinema.findById(id).lean();
};

const createCinema = async (cinemaData) => {
  const { rows, columns, ...restData } = cinemaData;

  if (rows && columns && (!cinemaData.seatLayout || cinemaData.seatLayout.length === 0)) {
    if (typeof rows !== 'number' || rows <= 0 || !Number.isInteger(rows)) {
      throw new Error('rows must be a positive integer');
    }
    if (typeof columns !== 'number' || columns <= 0 || !Number.isInteger(columns)) {
      throw new Error('columns must be a positive integer');
    }
    restData.seatLayout = generateSeatLayout(rows, columns);
  }

  const cinema = new Cinema({
    ...restData,
    rows,
    columns
  });

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
