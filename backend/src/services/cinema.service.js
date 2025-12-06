const Cinema = require('../models/cinema.model');

const getAllCinemas = async () => {
  return await Cinema.find({});
};

module.exports = {
  getAllCinemas,
};
