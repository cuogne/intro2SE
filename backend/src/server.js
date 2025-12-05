const app = require('./app');
const movieRoute = require('./routes/movie.routes');
const db = require('./config/mongodb.config');

const PORT = 3000;

// connect to MongoDB
db.connectMongoDB();

app.use('/api/v1', movieRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
});