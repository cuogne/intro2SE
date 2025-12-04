const movieService = require('../services/movie.service');

const getAllMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMovies();

    // status 200 OK
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    // status 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Error fetching movies',
      error: error.message,
    });
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params; // :id
    const movie = await movieService.getMovieById(id);
    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error getting a movie`,
      error: error.message,
    });
  }
};

const createMovie = async (req, res) => {
  try {
    const newMovie = await movieService.createMovie(req.body);

    // status 201 Created
    res.status(201).json({
      success: true,
      data: newMovie,
    });
  } catch (error) {
    // status 400 Bad Request
    res.status(400).json({
      success: false,
      message: 'error creating a movie',
      error: error.message,
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updMovie = await movieService.updateMovie(id, req.body);

    if (!updMovie) {
      return res.status(404).json({
        success: false,
        msg: 'movie not found',
      });
    }

    res.status(200).json({
      success: true,
      data: updMovie,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: 'error updating a movie',
      error: error.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const delMovie = await movieService.deleteMovie(id);

    if (!delMovie) {
      return res.status(404).json({
        success: false,
        message: 'movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'movie deleted successfully',
      data: delMovie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'error deleting a movie',
      error: error.message,
    });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};