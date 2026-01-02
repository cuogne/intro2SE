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
