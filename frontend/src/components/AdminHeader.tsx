import { NavLink, useNavigate, Link } from "react-router-dom";
import { Dropdown, ConfigProvider, theme } from "antd";
import type { MenuProps } from "antd";
import { LogoutOutlined, HistoryOutlined, SettingOutlined, HomeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import UserAvatar from "./UserAvatar";
import ProfileModal from "./ProfileModal";

export default function AdminHeader() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDarkTheme } = useTheme();
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const menuItems: MenuProps["items"] = [
        {
            key: "profile",
            label: "Quản lý tài khoản",
            icon: <SettingOutlined />,
            onClick: () => setProfileModalOpen(true),
        },
        {
            key: "home",
            label: "Về trang chủ",
            icon: <HomeOutlined />,
            onClick: () => navigate("/"),
        },
        {
            key: "booking-history",
            label: "Lịch sử đặt vé",
            icon: <HistoryOutlined />,
            onClick: () => navigate("/bookings"),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            label: "Đăng xuất",
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-border-dark bg-white dark:bg-[#111318] px-4 lg:px-10 py-3 shrink-0 z-20">
            <div className="flex items-center gap-4 lg:gap-8">
                <Link to="/admin" className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <h2 className="text-lg font-bold leading-tight tracking-tight hidden md:block">CineMax Admin</h2>
                </Link>
            </div>

            <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto md:overflow-x-hidden overflow-y-hidden">
                <nav className="flex items-center gap-6">
                    <NavLink
                        to="/admin/movies"
                        className={({ isActive }) =>
                            isActive
                                ? "text-primary text-sm font-bold leading-normal border-b-2 border-primary py-4 -my-4"
                                : "text-slate-500 dark:text-text-secondary hover:text-primary text-sm font-medium leading-normal transition-colors"
                        }
                    >
                        Phim
                    </NavLink>

                    <NavLink
                        to="/admin/showtimes"
                        className={({ isActive }) =>
                            isActive
                                ? "text-primary text-sm font-bold leading-normal border-b-2 border-primary py-4 -my-4"
                                : "text-slate-500 dark:text-text-secondary hover:text-primary text-sm font-medium leading-normal transition-colors"
                        }
                    >
                        Lịch chiếu
                    </NavLink>

                    <NavLink
                        to="/admin/cinema-rooms"
                        className={({ isActive }) =>
                            isActive
                                ? "text-primary text-sm font-bold leading-normal border-b-2 border-primary py-4 -my-4"
                                : "text-slate-500 dark:text-text-secondary hover:text-primary text-sm font-medium leading-normal transition-colors"
                        }
                    >
                        Phòng chiếu
                    </NavLink>
                    
                    <NavLink
                        to="/admin/staff"
                        className={({ isActive }) =>
                            isActive
                                ? "text-primary text-sm font-bold leading-normal border-b-2 border-primary py-4 -my-4"
                                : "text-slate-500 dark:text-text-secondary hover:text-primary text-sm font-medium leading-normal transition-colors"
                        }
                    >
                        Nhân Viên
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            isActive
                                ? "text-primary text-sm font-bold leading-normal border-b-2 border-primary py-4 -my-4"
                                : "text-slate-500 dark:text-text-secondary hover:text-primary text-sm font-medium leading-normal transition-colors"
                        }
                    >
                        Người Dùng
                    </NavLink>

                    <NavLink
                        to="/admin/payments"
                        className={({ isActive }) =>
                            isActive
                                ? "text-primary text-sm font-bold leading-normal border-b-2 border-primary py-4 -my-4"
                                : "text-slate-500 dark:text-text-secondary hover:text-primary text-sm font-medium leading-normal transition-colors"
                        }
                    >
                        Giao Dịch
                    </NavLink>
                </nav>

                <ConfigProvider
                    theme={{
                        token: {
                            colorBgContainer: isDarkTheme() ? "#111318" : "#fff",
                            colorText: isDarkTheme() ? "#fff" : "#000",
                        },
                        algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }}
                >
                    <div className="flex items-center gap-4">
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <span className="hidden md:block text-slate-900 dark:text-white text-sm font-medium group-hover:text-primary transition-colors">{user?.username || "Admin"}</span>
                                <UserAvatar size={40} showHoverEffect />
                            </div>
                        </Dropdown>
                    </div>
                </ConfigProvider>
            </div>
            <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
        </header>
    );
}
