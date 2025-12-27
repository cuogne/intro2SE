const app = require('./app');
const movieRoute = require('./routes/movie.route');
const cinemaRoute = require('./routes/cinema.route');
const showtimeRoute = require('./routes/showtime.route');
const userRoute = require('./routes/user.route');
const bookingRoute = require('./routes/booking.route');
const paymentRoute = require('./routes/payment.route');
const connectMongoDB = require('./config/mongodb.config');

const PORT = 3000;

app.use('/api/v1/movies', movieRoute);
app.use('/api/v1/cinemas', cinemaRoute);
app.use('/api/v1/showtimes', showtimeRoute);
app.use('/api/auth', userRoute);
app.use('/api/v1/bookings', bookingRoute);
app.use('/api/v1/payments', paymentRoute);

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
