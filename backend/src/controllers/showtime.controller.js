const showtimeService = require('../services/showtime.service');

const getShowtimes = async (req, res) => {
    try {
        const movie = req.query.movie;
        const date = req.query.date;
        const cinema = req.query.cinema;

        const showtimes = await showtimeService.getShowtimes(movie, date, cinema)
        res.status(200).json({
            success: true,
            data: showtimes
        });
    }
    catch (error){
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
        const newShowtime = await showtimeService.createShowtime(req.body);

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
    getShowtimes,
    getShowtimeById,
    createShowtime,
    updateShowtime,
    deleteShowtime
}