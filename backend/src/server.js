const app = require('./app');
const movieRoute = require('./routes/movie.route');
const cinemaRoute = require('./routes/cinema.route');
const showtimeRoute = require('./routes/showtime.route');
const authRoute = require('./routes/auth.route');
const bookingRoute = require('./routes/booking.route');
const paymentRoute = require('./routes/payment.route');
const userRoute = require('./routes/user.route');
const connectMongoDB = require('./config/mongodb.config');
const { startCleanupJob } = require('./utils/cleanupJob');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use('/api/v1/movies', movieRoute);
app.use('/api/v1/cinemas', cinemaRoute);
app.use('/api/v1/showtimes', showtimeRoute);
app.use('/api/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/bookings', bookingRoute);
app.use('/api/v1/payments', paymentRoute);

const startServer = async () => {
  try {
    // connect to MongoDB before starting the server
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📡 API endpoint: http://localhost:${PORT}/api/v1`);
      console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);

      startCleanupJob();
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('\n💡 Please check:');
    console.error('   1. Create a .env file in the backend directory');
    console.error('   2. Add MONGO_URI=your_mongodb_connection_string');
    console.error('   3. See .env.example for reference');
    process.exit(1);
  }
};

startServer();
