import api from "./api";

export interface StaffItem {
    _id: string;
    name: string;
    email: string;
    code: string;
    role: "manager" | "cashier" | "usher";
    status: "active" | "locked";
    avatar?: string;
    initials?: string;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StaffFilters {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
}

export interface StaffResponse {
    staffs: StaffItem[];
    total: number;
    page: number;
    totalPages: number;
}

// Get all staff with filters and pagination
export const getAllStaff = async (filters?: StaffFilters): Promise<StaffResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const res = await api.get(`/v1/staff?${params.toString()}`);
    return {
        staffs: res.data?.data || [],
        total: res.data?.pagination?.total || 0,
        page: res.data?.pagination?.page || 1,
        totalPages: res.data?.pagination?.totalPages || 1,
    };
};

// Get staff by ID
export const getStaffById = async (id: string): Promise<StaffItem> => {
    const res = await api.get(`/v1/staff/${id}`);
    return res.data?.data;
};

// Create new staff
export const createStaff = async (staff: Omit<StaffItem, "_id" | "createdAt" | "updatedAt">): Promise<StaffItem> => {
    const res = await api.post("/v1/staff", staff);
    return res.data?.data;
};

// Update staff
export const updateStaff = async (id: string, staff: Partial<StaffItem>): Promise<StaffItem> => {
    const res = await api.put(`/v1/staff/${id}`, staff);
    return res.data?.data;
};

// Delete staff
export const deleteStaff = async (id: string): Promise<void> => {
    await api.delete(`/v1/staff/${id}`);
};

// Toggle staff status
export const toggleStaffStatus = async (id: string): Promise<StaffItem> => {
    const res = await api.patch(`/v1/staff/${id}/status`);
    return res.data?.data;
};

// Update last login
export const updateLastLogin = async (id: string): Promise<StaffItem> => {
    const res = await api.patch(`/v1/staff/${id}/login`);
    return res.data?.data;
};
