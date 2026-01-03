import api from "./api";
import type { Movie } from "./movieService";
import type { Cinema } from "./cinemaService";

export interface ShowtimeSeat {
  row: string;
  number: number;
  isBooked: boolean;
  status: string;
}

// Summary item returned in list endpoints (smaller payload)
export interface ShowtimeListItem {
  _id: string;
  movie: {
    _id: string;
    title: string;
    minutes?: number;
    posterImg?: string;
    status?: string;
  };
  cinema: {
    _id: string;
    name: string;
    address?: string;
  };
  startTime: string; // ISO string
  endTime?: string; // ISO string
  price: number;
  totalSeats?: number;
  availableSeats?: number;
}

// Full detail returned by /v1/showtimes/:id
export interface ShowtimeDetail {
  _id: string;
  movie: Movie;
  cinema: Cinema;
  startTime: string;
  endTime?: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  seats?: ShowtimeSeat[];
}

export interface Pagination {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
}

export interface ShowtimesListResponse {
  docs: ShowtimeListItem[];
  pagination: Pagination;
}

export const getFixedDates = () => {
  // Lưu ý: Month trong JS bắt đầu từ 0 (11 là tháng 12)
  const fixedDates = [
    new Date(2025, 11, 7), // Ngày 07/12/2025
    new Date(2025, 11, 8), // Ngày 08/12/2025
  ];

  return fixedDates.map((d) => ({
    fullDate: d,
    dayName: `Thứ ${d.getDay() + 1 === 1 ? "CN" : d.getDay() + 1}`,
    dateStr: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`,
  }));
};

/**
 * Fetch paginated showtimes.
 * Supports optional filters: movieId, cinemaId, date (ISO yyyy-mm-dd)
 * NOTE: This function now returns the backend `docs` payload as-is (no local normalization).
 */
export const fetchShowtimes = async (
  page = 1,
  limit = 10,
  filters: { movieId?: string; cinemaId?: string; date?: string } = {}
): Promise<ShowtimesListResponse> => {
  try {
    const params = { page, limit, ...filters };
    const res = await api.get("/v1/showtimes", { params });

    // Support backend shapes: { success, data: { docs, ...paginationFields } } OR { docs, totalDocs, page, limit, totalPages }
    const payload = res.data?.data ?? res.data ?? {};

    // Docs can be at payload.docs or payload itself may be an array
    const docs: ShowtimeListItem[] = Array.isArray(payload)
      ? (payload as ShowtimeListItem[])
      : Array.isArray(payload.docs)
      ? payload.docs
      : [];

    // Pagination can be in payload.pagination or top-level pagination fields
    const pagination: Pagination = payload.pagination
      ? (payload.pagination as Pagination)
      : {
          page: payload.page ?? page,
          limit: payload.limit ?? limit,
          totalDocs:
            payload.totalDocs ?? (Array.isArray(docs) ? docs.length : 0),
          totalPages:
            payload.totalPages ??
            Math.ceil(
              (payload.totalDocs ?? (Array.isArray(docs) ? docs.length : 0)) /
                (payload.limit ?? limit) || 0
            ),
        };

    return { docs, pagination };
  } catch (error) {
    console.error("Lỗi gọi /v1/showtimes:", error);
    return {
      docs: [],
      pagination: { page, limit, totalDocs: 0, totalPages: 0 },
    };
  }
};

/**
 * Fetch single showtime by id
 */
export const fetchShowtimeById = async (
  id: string
): Promise<ShowtimeDetail | null> => {
  try {
    const res = await api.get(`/v1/showtimes/${id}`);
    const data = res.data?.data ?? res.data;
    // Backend returns { success: true, data: { ... } }
    const doc = Array.isArray(data)
      ? data.find((d) => d._id === id) ?? null
      : data ?? null;
    return doc as ShowtimeDetail | null;
  } catch (error) {
    console.error(`Lỗi khi gọi /v1/showtimes/${id}:`, error);
    return null;
  }
};

export interface CreateShowtimePayload {
  movieId: string;
  cinemaId: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  price?: number;
}

/**
 * Create a new showtime.
 * Body example:
 * {
 *   movieId: "507f1f77bcf86cd799439011",
 *   cinemaId: "507f1f77bcf86cd799439012",
 *   startTime: "2025-12-25T18:30:00.000Z",
 *   endTime: "2025-12-25T19:30:00.000Z",
 *   price: 45000
 * }
 */
export const createShowtime = async (
  payload: CreateShowtimePayload
): Promise<ShowtimeDetail | null> => {
  try {
    const res = await api.post("/v1/showtimes", payload);
    const data = res.data?.data ?? res.data;
    return (data as ShowtimeDetail) ?? null;
  } catch (error) {
    console.error("Lỗi tạo suất chiếu:", error);
    return null;
  }
};

export interface UpdateShowtimePayload {
  movie: string;
  cinema: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  price?: number;
}

export const updateShowtime = async (
  id: string,
  payload: Partial<UpdateShowtimePayload>
): Promise<ShowtimeDetail | null> => {
  try {
    const res = await api.put(`/v1/showtimes/${id}`, payload);
    const data = res.data?.data ?? res.data;
    return (data as ShowtimeDetail) ?? null;
  } catch (error) {
    console.error(`Lỗi cập nhật suất chiếu ${id}:`, error);
    return null;
  }
};

export const deleteShowtime = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/v1/showtimes/${id}`);
    return true;
  } catch (error) {
    console.error(`Lỗi xóa suất chiếu ${id}:`, error);
    return false;
  }
};

/**
 * Helper: fetch and group showtimes by cinema for a specific movie+date
 */
export interface CinemaShowtimeGroup {
  cinema: { _id: string; name: string; address?: string };
  showtimes: {
    id: string;
    time: string;
    price: number;
    availableSeats: number;
  }[];
}

export const fetchShowtimesByMovie = async (
  movieId: string,
  date: Date
): Promise<CinemaShowtimeGroup[]> => {
  try {
    const { docs } = await fetchShowtimes(1, 200, { movieId }); // summary docs

    const targetDateStr = date.toLocaleDateString("en-GB"); // DD/MM/YYYY

    const filtered = docs.filter(
      (s) =>
        new Date(s.startTime).toLocaleDateString("en-GB") === targetDateStr &&
        s.movie._id === movieId
    );

    const groupsMap: Record<string, CinemaShowtimeGroup> = {};

    filtered.forEach((s) => {
      const cid = s.cinema._id;
      if (!groupsMap[cid]) {
        groupsMap[cid] = {
          cinema: { _id: cid, name: s.cinema.name, address: s.cinema.address },
          showtimes: [],
        };
      }
      groupsMap[cid].showtimes.push({
        id: s._id,
        time: new Date(s.startTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: s.price,
        availableSeats: s.availableSeats ?? 0,
      });
    });

    return Object.values(groupsMap).map((g) => ({
      ...g,
      showtimes: g.showtimes.sort((a, b) => a.time.localeCompare(b.time)),
    }));
  } catch (error) {
    console.error("Lỗi lấy lịch chiếu theo phim:", error);
    return [];
  }
};
