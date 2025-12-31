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
    const res = await api.put(`/v1/users/${id}`, payload);
    return res.data;
};
