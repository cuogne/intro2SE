import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Định nghĩa kiểu dữ liệu User (khớp với model backend)
interface User {
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Khi F5 trang, tự động lấy user từ localStorage nếu có
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Hàm Đăng nhập (Lưu vào State + LocalStorage)
    const login = (userData: User, token: string) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", token);
    };

    // Hàm Đăng xuất
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
    };

    // Hàm cập nhật thông tin user
    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>;
};

// Hook để các component khác gọi dùng nhanh
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
