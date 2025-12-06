const app = require('./app');
const movieRoute = require('./routes/movie.routes');
const db = require('./config/mongodb.config');

const PORT = 3000;

app.use('/api/v1', movieRoute);

const startServer = async () => {
  try {
    // connect to MongoDB before starting the server
    await db.connectMongoDB();

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
