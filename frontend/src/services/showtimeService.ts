import api from './api';

// 1. Interface khớp với JSON suất chiếu bạn cung cấp
export interface ShowtimeAPI {
  _id: string;
  movie: {
    _id: string;
    title: string;
  };
  cinema: {
    _id: string;
    name: string;
  };
  startTime: string; // ISO String: "2025-12-07T02:00:00.000Z"
  price: number;
  totalSeats: number;
  availableSeats: number;
}

// 2. Interface cho Rạp (để lấy địa chỉ)
export interface CinemaAPI {
  _id: string;
  name: string;
  address: string;
}

// 3. Interface dữ liệu đã nhóm (Dùng cho UI hiển thị)
export interface CinemaShowtimeGroup {
  cinema: {
    _id: string;
    name: string;
    address: string;
  };
  showtimes: {
    id: string; // ID của suất chiếu (để click đặt vé)
    time: string; // Giờ hiển thị (VD: "09:00")
  }[]; 
}

// Hàm tạo 7 ngày tiếp theo (giữ nguyên)
// export const getNext7Days = () => {
//   const dates = [];
//   const today = new Date();
//   for (let i = 0; i < 7; i++) {
//     const d = new Date(today);
//     d.setDate(today.getDate() + i);
//     dates.push({
//       fullDate: d,
//       dayName: i === 0 ? 'Hôm nay' : `Thứ ${d.getDay() + 1 === 1 ? 'CN' : d.getDay() + 1}`,
//       dateStr: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
//     });
//   }
//   return dates;
// };

export const getFixedDates = () => {
  // Lưu ý: Month trong JS bắt đầu từ 0 (11 là tháng 12)
  const fixedDates = [
    new Date(2025, 11, 7), // Ngày 07/12/2025
    new Date(2025, 11, 8)  // Ngày 08/12/2025
  ];

  return fixedDates.map(d => ({
    fullDate: d,
    dayName: `Thứ ${d.getDay() + 1 === 1 ? 'CN' : d.getDay() + 1}`,
    dateStr: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
  }));
};

// Hàm lấy và xử lý dữ liệu thật
export const fetchShowtimesByMovie = async (movieId: string, date: Date): Promise<CinemaShowtimeGroup[]> => {
  try {
    // Bước 1: Gọi API lấy tất cả suất chiếu (Hoặc lọc theo query nếu backend hỗ trợ)
    // Giả định backend trả về: { data: [...] } hoặc [...]
    const resShowtimes = await api.get('/v1/showtimes');
    const allShowtimes: ShowtimeAPI[] = Array.isArray(resShowtimes.data) 
        ? resShowtimes.data 
        : resShowtimes.data.data || [];

    // Bước 2: Gọi API lấy danh sách rạp để lấy Địa Chỉ (vì trong showtime không có address)
    let cinemas: CinemaAPI[] = [];
    try {
        const resCinemas = await api.get('/v1/cinemas');
        cinemas = Array.isArray(resCinemas.data) ? resCinemas.data : resCinemas.data.data || [];
    } catch (e) {
        console.warn("Không lấy được danh sách rạp, sẽ hiển thị thiếu địa chỉ.");
    }

    // Bước 3: Lọc dữ liệu Client-side
    // - Đúng phim (movieId)
    // - Đúng ngày (So sánh ngày/tháng/năm)
    const targetDateStr = date.toLocaleDateString('en-GB'); // DD/MM/YYYY

    const filteredShowtimes = allShowtimes.filter(item => {
        const itemDate = new Date(item.startTime);
        const itemDateStr = itemDate.toLocaleDateString('en-GB');
        
        // So sánh ID phim và Ngày chiếu
        return item.movie._id === movieId && itemDateStr === targetDateStr;
    });

    // Bước 4: Nhóm suất chiếu theo Rạp (Grouping)
    const groups: { [key: string]: CinemaShowtimeGroup } = {};

    filteredShowtimes.forEach(item => {
        const cinemaId = item.cinema._id;
        
        // Nếu rạp này chưa có trong nhóm, tạo mới
        if (!groups[cinemaId]) {
            // Tìm thông tin địa chỉ từ danh sách rạp đã fetch ở B2
            const cinemaDetail = cinemas.find(c => c._id === cinemaId);
            
            groups[cinemaId] = {
                cinema: {
                    _id: cinemaId,
                    name: item.cinema.name,
                    address: cinemaDetail ? cinemaDetail.address : 'Đang cập nhật địa chỉ...'
                },
                showtimes: []
            };
        }

        // Format giờ từ ISO string sang giờ:phút (VD: 09:00)
        const timeDate = new Date(item.startTime);
        const timeStr = timeDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        groups[cinemaId].showtimes.push({
            id: item._id, // Lưu ID suất chiếu để sau này dùng đặt vé
            time: timeStr
        });
    });

    // Chuyển object groups thành mảng và sắp xếp giờ chiếu tăng dần
    return Object.values(groups).map(group => ({
        ...group,
        showtimes: group.showtimes.sort((a, b) => a.time.localeCompare(b.time))
    }));

  } catch (error) {
    console.error("Lỗi lấy lịch chiếu:", error);
    return [];
  }
};