<<<<<<< HEAD
import api from './api';

export interface Seat {
  row: string;
  number: number;
}

export interface Booking {
  _id: string;
  showtime: {
    _id: string;
    movie: {
      _id: string;
      title: string;
      minutes: number;
    };
    cinema: {
      _id: string;
      name: string;
      address: string;
    };
    startTime: string;
    price: number;
  };
  user: {
    _id: string;
    username: string;
  };
  seat: Seat[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  holdExpiresAt?: string;
  paidAt?: string;
  paymentProvider?: string;
  paymentTransId?: string;
  paymentMeta?: any;
  bookedAt: string;
}

export interface ReserveSeatsResponse {
  bookingId: string;
  holdExpiresAt: string;
  expiresInSeconds: number;
  isNewBooking: boolean;
  message: string;
}

export interface UpdateSeatsResponse {
  bookingId: string;
  holdExpiresAt: string;
  expiresInSeconds: number;
  message: string;
  deleted?: boolean;
}

// GET /api/v1/bookings - Lấy lịch sử đặt vé của user
export const getBookingHistory = async (): Promise<Booking[]> => {
  try {
    const response = await api.get('/v1/bookings');
    const data = response.data;
    
    if (Array.isArray(data)) {
      return data;
    }
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return [];
  }
};

// GET /api/v1/bookings/:id - Lấy chi tiết booking
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    const response = await api.get(`/v1/bookings/${bookingId}`);
    const data = response.data;
    
    if (data.data) {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

// POST /api/v1/bookings - Đặt ghế (tạo booking mới hoặc thêm vào booking hiện có)
export const reserveSeats = async (
  showtimeId: string,
  seats: Seat[]
): Promise<ReserveSeatsResponse> => {
  try {
    const response = await api.post('/v1/bookings', {
      showtimeId,
      seats
    });
    
    const data = response.data;
    if (data.data) {
      return data.data;
    }
    return data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

// PATCH /api/v1/bookings/:id/seats - Thêm/xóa ghế khỏi booking
export const updateBookingSeats = async (
  bookingId: string,
  action: 'add' | 'remove',
  seats: Seat[]
): Promise<UpdateSeatsResponse> => {
  try {
    const response = await api.patch(`/v1/bookings/${bookingId}/seats`, {
      action,
      seats
    });
    
    const data = response.data;
    if (data.data) {
      return data.data;
    }
    return data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

=======
import api from "./api";

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

export interface BookingsResponse {
    success: boolean;
    data: BookingItem[];
}

export const fetchAllBookings = async (): Promise<BookingItem[]> => {
    const response = await api.get<BookingsResponse>("/v1/bookings/all");
    return response.data.data;
};

export interface StatisticsResponse {
    success: boolean;
    data: BookingStatistics;
}

export const fetchBookingStatistics = async (params: { fromDate: string; toDate: string; movieId?: string; cinemaId?: string }): Promise<BookingStatistics> => {
    const queryParams = new URLSearchParams();
    queryParams.append("fromDate", params.fromDate);
    queryParams.append("toDate", params.toDate);
    if (params.movieId) queryParams.append("movieId", params.movieId);
    if (params.cinemaId) queryParams.append("cinemaId", params.cinemaId);

    const response = await api.get<StatisticsResponse>(`/v1/bookings/statistics?${queryParams.toString()}`);
    return response.data.data;
};
>>>>>>> admin-pages
