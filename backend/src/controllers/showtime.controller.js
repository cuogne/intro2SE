const showtimeService = require('../services/showtime.service');

const getShowtimesByQuery = async (req, res) => {
    try {
        const movie = req.query.movieId;
        const date = req.query.date; // YYYY-MM-DD
        const cinema = req.query.cinemaId;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        // api/v1/showtimes?movieId=movieId&cinemaId=cinemaId&date=2025-12-18&page=1&limit=10
        const showtimes = await showtimeService.getShowtimesByQuery(movie, date, cinema, page, limit)
        res.status(200).json({
            success: true,
            data: showtimes
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching showtimes',
            error: error.message
        });
    }
}

const getShowtimeById = async (req, res) => {
    try {
        const { id } = req.params;
        const showtime = await showtimeService.getShowtimeById(id);

        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: 'showtime not found',
            });
        }

        res.status(200).json({
            success: true,
            data: showtime,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting a showtime',
            error: error.message,
        });
    }
};

const createShowtime = async (req, res) => {
    try {
        // Map API field names to model field names
        const { movieId, cinemaId, startTime, price } = req.body;

        if (!movieId || !cinemaId || !startTime) {
            return res.status(400).json({
                success: false,
                message: 'movieId, cinemaId, and startTime are required'
            });
        }

        const showtimeData = {
            movie: movieId,
            cinema: cinemaId,
            startTime,
            ...(price && { price }) // Only include price if provided
        };

        const newShowtime = await showtimeService.createShowtime(showtimeData);

        res.status(201).json({
            success: true,
            data: newShowtime,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error creating a showtime',
            error: error.message,
        });
    }
};

const updateShowtime = async (req, res) => {
    try {
        const { id } = req.params;
        const updShowtime = await showtimeService.updateShowtime(id, req.body);

        if (!updShowtime) {
            return res.status(404).json({
                success: false,
                message: 'showtime not found',
            });
        }

        res.status(200).json({
            success: true,
            data: updShowtime,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error updating a showtime',
            error: error.message,
        });
    }
};

const deleteShowtime = async (req, res) => {
    try {
        const { id } = req.params;
        const delShowtime = await showtimeService.deleteShowtime(id);

        if (!delShowtime) {
            return res.status(404).json({
                success: false,
                message: 'showtime not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'showtime deleted successfully',
            data: delShowtime,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'error deleting a showtime',
            error: error.message,
        });
    }
};

module.exports = {
    getShowtimesByQuery,
    getShowtimeById,
    createShowtime,
    updateShowtime,
    deleteShowtime
}