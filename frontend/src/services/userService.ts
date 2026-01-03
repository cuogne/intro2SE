import api from "./api";

export interface UserItem {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getAllUsers = async (): Promise<UserItem[]> => {
    const res = await api.get("/v1/users/all");
    return res.data?.data || [];
};

export const updateUser = async (id: string, payload: Partial<UserItem>) => {
    const res = await api.put(`/v1/users/all/${id}`, payload);
    return res.data;
};

// Get current user profile
export const getUserProfile = async (): Promise<UserItem> => {
    const res = await api.get("/v1/users/me");
    return res.data?.data;
};

// Update current user profile
export const updateUserProfile = async (payload: { username?: string; email?: string }) => {
    const res = await api.put("/v1/users/me/update", payload);
    return res.data?.data;
};

// Change password
export const changePassword = async (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    const res = await api.put("/v1/users/me/password", payload);
    return res.data;
};
