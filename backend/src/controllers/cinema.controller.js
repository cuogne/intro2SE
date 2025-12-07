const { get } = require('mongoose');
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

const getCinemaById = async (req, res) => {
  try {
    const { id } = req.params; // :id
    const cinema = await cinemaService.getCinemaById(id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'cinema not found',
      });
    }

    res.status(200).json({
      success: true,
      data: cinema,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting a cinema',
      error: error.message,
    });
  }
};

const createCinema = async (req, res) => {
  try {
    const newCinema = await cinemaService.createCinema(req.body);

    res.status(201).json({
      success: true,
      data: newCinema,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'error creating a cinema',
      error: error.message,
    });
  }
};

const updateCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const updCinema = await cinemaService.updateCinema(id, req.body);

    if (!updCinema) {
      return res.status(404).json({
        success: false,
        message: 'cinema not found',
      });
    }

    res.status(200).json({
      success: true,
      data: updCinema,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'error updating a cinema',
      error: error.message,
    });
  }
};

const deleteCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const delCinema = await cinemaService.deleteCinema(id);

    if (!delCinema) {
      return res.status(404).json({
        success: false,
        message: 'cinema not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'cinema deleted successfully',
      data: delCinema,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'error deleting a cinema',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
};
