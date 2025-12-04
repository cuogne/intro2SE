const app = require('./app');
const apiV1Routes = require('./routes/api.v1.routes');
const connectMongoDB = require('./config/mongodb.config');

const PORT = process.env.PORT || 3000;

// connect to MongoDB
connectMongoDB();

app.use('/api/v1', apiV1Routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
});