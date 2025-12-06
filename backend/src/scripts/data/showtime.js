const mongoose = require('mongoose');
const Movie = require('../../models/movie.model');     // Nhớ trỏ đúng đường dẫn file model
const Cinema = require('../../models/cinema.model');
const Showtime = require('../../models/showtime.model');

const generateShowtimes = async () => {
  try {

    // 1. Lấy dữ liệu Phim và Rạp có sẵn
    const movies = await Movie.find();
    const cinemas = await Cinema.find();

    if (movies.length === 0 || cinemas.length === 0) {
      console.log('❌ Cần tạo Movie và Cinema trước!');
      process.exit();
    }

    // Xóa dữ liệu cũ nếu muốn làm mới
    await Showtime.deleteMany({});
    console.log('🗑️ Đã xóa showtimes cũ');

    const showtimesData = [];
    const daysToGenerate = 2; // Tạo lịch cho 7 ngày tới
    const timeSlots = [9, 12, 15, 18, 21]; // Các khung giờ chiếu: 9h, 12h...

    // 2. Tạo vòng lặp: Duyệt từng Rạp -> Từng Ngày -> Từng Khung giờ
    cinemas.forEach((cinema) => {
      for (let i = 0; i < daysToGenerate; i++) {
        
        // Tạo ngày: Hôm nay + i ngày
        const date = new Date();
        date.setDate(date.getDate() + i); 

        timeSlots.forEach((hour) => {
          // Setup giờ chiếu cụ thể
          const startTime = new Date(date);
          startTime.setHours(hour, 0, 0, 0); // set giờ, phút, giây

          // Chọn ngẫu nhiên 1 phim trong 16 phim
          const randomMovie = movies[Math.floor(Math.random() * movies.length)];

          // 3. QUAN TRỌNG: Copy layout ghế từ Rạp sang Suất chiếu
          // Thêm isBooked: false cho từng ghế
          const seats = cinema.seatLayout.map((seat) => ({
            row: seat.row,
            number: seat.number,
            isBooked: false, // Mặc định chưa đặt
            user: null
          }));

          // Giả bộ random vài ghế đã đặt (để test giao diện)
          if (Math.random() > 0.7 && seats.length >= 2) { // 30% cơ hội suất này có người đặt
             seats[0].isBooked = true; // Ghế đầu tiên bị đặt
             seats[1].isBooked = true; // Ghế thứ 2 bị đặt
          }

          showtimesData.push({
            movie: randomMovie._id,
            cinema: cinema._id,
            startTime: startTime,
            price: 75000, // Giá vé mặc định
            seats: seats
          });
        });
      }
    });

    // 4. Lưu một lèo vào DB
    await Showtime.insertMany(showtimesData);
    console.log(`✅ Đã tạo thành công ${showtimesData.length} suất chiếu!`);

  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = generateShowtimes