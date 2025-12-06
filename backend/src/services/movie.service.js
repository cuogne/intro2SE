const Movie = require('../models/movie.model');

const getAllMovies = async (page, limit) => {
  const skip = (page - 1) * limit;

  // api/v1/movies?page=1&limit=8
  const results = Movie.find({}).skip(skip).limit(limit);

  const totalMovie = Movie.countDocuments(); // get total movies

  const [movies, total] = await Promise.all([results, totalMovie]);

  const totalPages = Math.ceil(total / limit);

  // return await Movie.find({})
  //   .skip(skip)
  //   .limit(limit);

  return {
    movies,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
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
