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

// Mock fallback (from the sample response you provided)
const MOCK_CINEMAS: Cinema[] = [
  {
    _id: "6944be92946fe3fc1e3fab08",
    name: "Cinemax Sinh Viên",
    address: "Nhà Văn Hóa Sinh Viên, Đông Hoà, Dĩ An, Bình Dương",
    status: "open",
    type: "2dstandard",
    capacity: 100,
    rows: 7,
    columns: 10,
    seatLayout: [
      {
        _id: "6944be92946fe3fc1e3fab09",
        row: "A",
        seats: ["A1", "A2", "A3", "A4", "A5"],
      },
      {
        _id: "6944be92946fe3fc1e3fab0a",
        row: "B",
        seats: ["B1", "B2", "B3", "B4", "B5"],
      },
      {
        _id: "6944be92946fe3fc1e3fab0b",
        row: "C",
        seats: ["C1", "C2", "C3", "C4", "C5"],
      },
      {
        _id: "6944be92946fe3fc1e3fab0c",
        row: "D",
        seats: ["D1", "D2", "D3", "D4", "D5"],
      },
      {
        _id: "6944be92946fe3fc1e3fab0d",
        row: "E",
        seats: ["E1", "E2", "E3", "E4", "E5"],
      },
    ],
  },
  {
    _id: "6944be99946fe3fc1e3fab10",
    name: "Cinemax Thủ Đức",
    address: "216 Đ. Võ Văn Ngân, Bình Thọ, Thủ Đức, Thành phố Hồ Chí Minh",
    status: "open",
    type: "2dstandard",
    capacity: 100,
    rows: 7,
    columns: 10,
    seatLayout: [
      {
        _id: "6944be99946fe3fc1e3fab11",
        row: "A",
        seats: ["A1", "A2", "A3", "A4", "A5", "A6"],
      },
      {
        _id: "6944be99946fe3fc1e3fab12",
        row: "B",
        seats: ["B1", "B2", "B3", "B4", "B5", "B6"],
      },
      {
        _id: "6944be99946fe3fc1e3fab13",
        row: "C",
        seats: ["C1", "C2", "C3", "C4", "C5", "C6"],
      },
      {
        _id: "6944be99946fe3fc1e3fab14",
        row: "D",
        seats: ["D1", "D2", "D3", "D4", "D5", "D6"],
      },
      {
        _id: "6944be99946fe3fc1e3fab15",
        row: "E",
        seats: ["E1", "E2", "E3", "E4", "E5", "E6"],
      },
    ],
  },
];

export const fetchCinemas = async (): Promise<Cinema[]> => {
  try {
    const res = await api.get("/v1/cinemas");
    // Backend may return: { success: true, data: [...] } or directly [...]
    const data = Array.isArray(res.data)
      ? res.data
      : res.data?.data ?? res.data;
    return Array.isArray(data) ? data : MOCK_CINEMAS;
  } catch (error) {
    console.error("❌ Lỗi khi gọi /v1/cinemas:", error);
    return MOCK_CINEMAS;
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
    return MOCK_CINEMAS.find((c) => c._id === id) ?? null;
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
