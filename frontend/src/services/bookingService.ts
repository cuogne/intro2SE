import api from "./api";

// --- PHẦN 1: COMMON TYPES (Dùng chung) ---

export interface Seat {
  row: string;
  number: number;
}

// --- PHẦN 2: ADMIN & STATISTICS (Thống kê và Quản lý) ---

export interface StatsByMovie {
  revenue: number;
  tickets: number;
  bookings: number;
  movieId: string;
  movieTitle: string;
}

export interface StatsByCinema {
  revenue: number;
  tickets: number;
  bookings: number;
  cinemaId: string;
  cinemaName: string;
}

export interface BookingItem {
  id: string;
  user: string;
  movie: string;
  cinema: string;
  address: string;
  startTime: string;
  totalPrice: number;
  seat: string[];
  quantity: number;
  status: "confirmed" | "pending" | "cancelled";
  bookedAt: string;
  paidAt?: string;
  paymentProvider?: string;
  paymentTransId?: string;
  paymentMeta?: {
    requestId?: string;
    payUrl?: string;
    provider?: string;
    momoTransId?: number;
    callbackTime?: string;
  };
}

export interface BookingStatistics {
  totalRevenue: number;
  totalBookings: number;
  totalTickets: number;
  byMovie: StatsByMovie[];
  byCinema: StatsByCinema[];
  transactions: BookingItem[];
  filters?: {
    fromDate: string;
    toDate: string;
    movieId?: string;
    cinemaId?: string;
  };
}

export interface BookingsResponse {
  success: boolean;
  data: BookingItem[];
}

export interface StatisticsResponse {
  success: boolean;
  data: BookingStatistics;
}

// API: Lấy tất cả booking (Admin)
// Backend Route: router.get('/all', ...)
export const fetchAllBookings = async (): Promise<BookingItem[]> => {
  const response = await api.get<BookingsResponse>("/v1/bookings/all");
  return response.data.data;
};

// API: Lấy thống kê (Admin)
// Backend Route: router.get('/statistics', ...)
export const fetchBookingStatistics = async (params: {
  fromDate: string;
  toDate: string;
  movieId?: string;
  cinemaId?: string;
}): Promise<BookingStatistics> => {
  const queryParams = new URLSearchParams();
  queryParams.append("fromDate", params.fromDate);
  queryParams.append("toDate", params.toDate);
  if (params.movieId) queryParams.append("movieId", params.movieId);
  if (params.cinemaId) queryParams.append("cinemaId", params.cinemaId);

  const response = await api.get<StatisticsResponse>(
    `/v1/bookings/statistics?${queryParams.toString()}`
  );
  return response.data.data;
};

// --- PHẦN 3: CLIENT & RESERVATION (Đặt vé phía người dùng) ---

export interface SeatReservationResponse {
  bookingId: string;
  holdExpiresAt: string; // ISO string
}

export interface Booking {
  _id: string;
  showtime: {
    _id: string;
    startTime: string;
    movie: {
      title: string;
    };
    cinema: {
      name: string;
      address: string;
    };
  };
  seat: Seat[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paidAt?: string;
}

// API: Giữ ghế (Tạo booking pending)
// Backend Route: router.post('/', ...) -> đường dẫn gốc /v1/bookings
export const reserveSeats = async (
  showtimeId: string,
  seats: Seat[]
): Promise<SeatReservationResponse> => {
  // SỬA: Xóa '/reserve' vì backend bắt ở '/'
  const response = await api.post("/v1/bookings", {
    showtimeId,
    seats,
  });
  return response.data.data;
};
// API: Cập nhật ghế (Thêm/Xóa ghế trong lúc giữ chỗ)
// Backend Route: router.patch('/:id/seats', ...)
export const updateBookingSeats = async (
  bookingId: string,
  action: "add" | "remove",
  seats: Seat[]
): Promise<boolean> => {
  try {
    // SỬA: Đổi method từ PUT sang PATCH để khớp backend
    await api.patch(`/v1/bookings/${bookingId}/seats`, {
      action,
      seats,
    });
    return true;
  } catch (error) {
    console.error("Lỗi cập nhật ghế:", error);
    throw error;
  }
};

// API: Lấy chi tiết booking theo ID
// Backend Route: router.get('/:id', ...)
export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const response = await api.get(`/v1/bookings/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi lấy thông tin booking:", error);
    return null;
  }
};
