import api from "./api";

// Response từ ZaloPay
export interface ZaloPayResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  zp_trans_token: string;
  order_url: string; // Link redirect
  cashier_order_url: string;
  order_token: string;
  qr_code: string;
}

// Response từ MoMo
export interface MomoResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string; // Link redirect
}

// POST /api/v1/payments/zalopay
export const createZaloPayOrder = async (
  bookingId: string
): Promise<ZaloPayResponse> => {
  try {
    const response = await api.post("/v1/payments/zalopay", { bookingId });
    // Backend trả về: { success: true, data: { ... } }
    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;
    throw new Error(errorMessage);
  }
};

// POST /api/v1/payments/momo
export const createMomoPayment = async (
  bookingId: string
): Promise<MomoResponse> => {
  try {
    const response = await api.post("/v1/payments/momo", { bookingId });
    // Backend trả về object trực tiếp hoặc trong data, tùy controller.
    // Dựa theo README thì response trả về json thẳng.
    // Tuy nhiên nếu axios wrap thì thường là response.data.
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;
    throw new Error(errorMessage);
  }
};
