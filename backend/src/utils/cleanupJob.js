const bookingService = require('../services/booking.service');

const startCleanupJob = () => {
    // Chạy ngay lần đầu
    runCleanup();

    const interval = setInterval(async () => {
        await runCleanup();
    }, 60000); // 1 phút

    // Cleanup khi process exit
    process.on('SIGTERM', () => {
        clearInterval(interval);
    });

    process.on('SIGINT', () => {
        clearInterval(interval);
    });
};

const runCleanup = async () => {
    try {
        const cleanedCount = await bookingService.cleanupExpiredBookings();
        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} expired booking(s)`);
        }
    } catch (error) {
        console.error('Error in cleanup job:', error.message);
    }
};

module.exports = {
    startCleanupJob
};

