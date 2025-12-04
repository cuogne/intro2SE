const Movie = require('../models/movie.model');

const getAllMovies = async () => {
  return await Movie.find({});
};

const getMovieById = async (id) => {
  return await Movie.findById(id);
};

const createMovie = async (movieData) => {
  const movie = new Movie(movieData);
  return await movie.save();
};

const updateMovie = async (id, movieData) => {
  return await Movie.findByIdAndUpdate(id, movieData, {
    new: true,
    runValidators: true,
  });
};

const deleteMovie = async (id) => {
  return await Movie.findByIdAndDelete(id);
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
