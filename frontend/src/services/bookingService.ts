import api from "./api";

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
