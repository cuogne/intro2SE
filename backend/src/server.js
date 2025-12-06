const app = require('./app');
const movieRoute = require('./routes/movie.routes');
const cinemaRoute = require('./routes/cinema.routes');
const showtimeRoute = require('./routes/showtime.routes');
const connectMongoDB = require('./config/mongodb.config');

const PORT = 3000;

app.use('/api/v1/movies', movieRoute);
app.use('/api/v1/cinema', cinemaRoute);
app.use('/api/v1/showtime', showtimeRoute);

const startServer = async () => {
  try {
    // connect to MongoDB before starting the server
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
