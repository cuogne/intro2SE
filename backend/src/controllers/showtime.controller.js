const showtimeService = require('../services/showtime.service');

const getShowtimes = async (req, res) => {
  try {
    const showtimes = await showtimeService.getAllShowtimes();
    
    return res.status(200).json({
      success: true,
      count: showtimes.length, // Thêm cái này để biết có bao nhiêu suất
      data: showtimes
    });
  }
  catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi lấy danh sách suất chiếu',
      error: error.message 
    });
  }
};

module.exports = {
  getShowtimes,
};