const cinemaService = require('../services/cinema.service');

const getAllCinemas = async (req, res) => {
  try {
    const cinemas = await cinemaService.getAllCinemas();
    res.status(200).json({
      success: true,
      data: cinemas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cinemas',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCinemas,
};
