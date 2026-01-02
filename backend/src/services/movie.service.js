const Movie = require('../models/movie.model');

// GET api/v1/movies?status=now_showing&page=1&limit=8&search=name
const getMoviesByQuery = async (page, limit, status, search) => {
  const skip = (page - 1) * limit

  // Build query filter
  const filter = { status }
  if (search) {
    filter.title = { $regex: search, $options: 'i' } // case-insensitive search
  }

  const results = Movie.find(filter).skip(skip).limit(limit)
  const totalMovie = Movie.countDocuments(filter) // get total movies with status and search
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
