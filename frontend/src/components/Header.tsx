import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, ConfigProvider, theme } from "antd";
import type { MenuProps } from "antd";
import { LogoutOutlined, HistoryOutlined, SettingOutlined, DashboardOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";
import UserAvatar from "./UserAvatar";
import { useTheme } from "../context/ThemeContext";

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const { isDarkTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate("/movies");
        }
    };

    const menuItems: MenuProps["items"] = [
        {
            key: "profile",
            label: "Quản lý tài khoản",
            icon: <SettingOutlined />,
            onClick: () => setProfileModalOpen(true),
        },
        {
            key: "booking-history",
            label: "Lịch sử đặt vé",
            icon: <HistoryOutlined />,
            onClick: () => navigate("/bookings"),
        },
        ...(user?.role === "admin"
            ? [
                  {
                      type: "divider" as const,
                  },
                  {
                      key: "admin",
                      label: "Quản lý hệ thống",
                      icon: <DashboardOutlined />,
                      onClick: () => navigate("/admin"),
                  },
              ]
            : []),
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
        <>
            <header className="sticky top-0 z-50 border-b border-solid border-slate-200 dark:border-border-dark bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-4 lg:px-10 py-3">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white hover:text-primary transition-colors">
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">CineMax</h2>
                        </Link>
                        {/* Desktop Search */}
                        <div className="hidden md:flex flex-col min-w-80">
                            <form
                                onSubmit={handleSearch}
                                className="flex w-full flex-1 items-stretch rounded-lg p-1.5 h-10 bg-slate-100 dark:bg-[#232f48] group focus-within:ring-2 focus-within:ring-primary/50 transition-all"
                            >
                                <div className="text-slate-400 dark:text-[#92a4c9] flex items-center justify-center pl-3">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex w-full min-w-0 flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] px-3 text-md font-normal"
                                    placeholder="Tìm kiếm phim..."
                                />
                            </form>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* Actions */}
                        <div className="flex gap-3">
                            {user ? (
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorBgContainer: isDarkTheme() ? "#111318" : "#f8fafc",
                                            colorText: isDarkTheme() ? "#fff" : "#000",
                                            colorBorder: isDarkTheme() ? "#2d3748" : "#e2e8f0",
                                        },
                                        algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                                    }}
                                >
                                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
                                        <div className="flex items-center gap-3 cursor-pointer group">
                                            <span className="hidden md:block text-slate-900 dark:text-white text-sm font-medium group-hover:text-primary transition-colors">{user.username}</span>
                                            <UserAvatar size={40} showHoverEffect />
                                        </div>
                                    </Dropdown>
                                </ConfigProvider>
                            ) : (
                                <>
                                    <Link to="/auth">
                                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-transparent border border-slate-300 dark:border-[#232f48] text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors">
                                            Đăng ký
                                        </button>
                                    </Link>
                                    <Link to="/auth">
                                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                                            Đăng nhập
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
        </>
    );
};

export default Header;
