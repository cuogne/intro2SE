import api from "./api";

export interface SeatLayoutRow {
  _id?: string;
  row: string;
  seats: string[];
}

export interface Cinema {
  _id: string;
  name: string;
  address: string;
  status?: string; //open, closed, renovating
  type?: string; //2dstandard, 3dvip, imax
  capacity?: number;
  rows?: number;
  columns?: number;
  seatLayout?: SeatLayoutRow[];
}

export const fetchCinemas = async (): Promise<Cinema[]> => {
  try {
    const res = await api.get("/v1/cinemas");
    // Backend may return: { success: true, data: [...] } or directly [...]
    const data = Array.isArray(res.data)
      ? res.data
      : res.data?.data ?? res.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Lỗi khi gọi /v1/cinemas:", error);
    return [];
  }
};

export const fetchCinemaById = async (id: string): Promise<Cinema | null> => {
  try {
    const res = await api.get(`/v1/cinemas/${id}`);
    const data = res.data?.data ?? res.data;
    if (Array.isArray(data)) {
      return data.find((c) => c._id === id) ?? null;
    }
    return data || null;
  } catch (error) {
    console.error(`❌ Lỗi khi gọi /v1/cinemas/${id}:`, error);
    return null;
  }
};

export const createCinema = async (
  payload: Partial<Cinema>
): Promise<Cinema | null> => {
  try {
    const res = await api.post("/v1/cinemas", payload);
    return res.data?.data ?? res.data ?? null;
  } catch (error) {
    console.error("❌ Lỗi tạo rạp:", error);
    return null;
  }
};

export const updateCinema = async (
  id: string,
  payload: Partial<Cinema>
): Promise<Cinema | null> => {
  try {
    const res = await api.put(`/v1/cinemas/${id}`, payload);
    return res.data?.data ?? res.data ?? null;
  } catch (error) {
    console.error(`❌ Lỗi cập nhật rạp ${id}:`, error);
    return null;
  }
};

export const deleteCinema = async (id: string): Promise<boolean> => {
  try {
    const res = await api.delete(`/v1/cinemas/${id}`);
    return res.data?.success ?? false;
  } catch (error) {
    console.error(`❌ Lỗi xóa rạp ${id}:`, error);
    return false;
  }
};
