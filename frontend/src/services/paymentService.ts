import api from './api';

export interface PaymentOrderResponse {
  order_url: string;
  app_trans_id: string;
  zp_trans_id?: string;
  amount: number;
}

// POST /api/v1/payments - Tạo order thanh toán Zalopay
export const createPaymentOrder = async (bookingId: string): Promise<PaymentOrderResponse> => {
  try {
    const response = await api.post('/v1/payments', {
      bookingId
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

