const app = require('./app');
const apiV1Routes = require('./routes/api.v1.routes');

const PORT = process.env.PORT || 3000;

app.use('/api/v1', apiV1Routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
});