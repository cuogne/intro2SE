const Movie = require('../models/movie.model');

// GET api/v1/movies?status=now_showing&page=1&limit=8
const getMoviesByQuery = async (page, limit, status) => {
  const skip = (page - 1) * limit
  const results = Movie.find({ status }).skip(skip).limit(limit)
  const totalMovie = Movie.countDocuments({ status }) // get total movies with status
  const [movies, total] = await Promise.all([results, totalMovie])
  const totalPages = Math.ceil(total / limit)
  
  return {
    movies,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

// GET api/v1/movies/:id
const getMovieById = async (id) => {
  return await Movie.findById(id);
};

// POST api/v1/movies
const createMovie = async (movieData) => {
  const movie = new Movie(movieData);
  return await movie.save();
};

// PUT api/v1/movies/:id
const updateMovie = async (id, movieData) => {
  return await Movie.findByIdAndUpdate(id, movieData, {
    new: true,
    runValidators: true,
  });
};

// DELETE api/v1/movies/:id
const deleteMovie = async (id) => {
  return await Movie.findByIdAndDelete(id);
};

module.exports = {
  getMoviesByQuery,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
