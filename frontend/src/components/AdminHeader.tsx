import { NavLink } from "react-router-dom";

type AdminHeaderProps = {
    onLogout?: () => void;
};

const noopVoid = () => {};

export default function AdminHeader({ onLogout = noopVoid}: AdminHeaderProps) {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-border-dark bg-white dark:bg-[#111318] px-4 lg:px-10 py-3 shrink-0 z-20">
            <div className="flex items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <div className="size-8 text-primary">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight hidden md:block">Cinema Admin</h2>
                </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-8">
                <nav className="hidden lg:flex items-center gap-6">
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
                        to="/admin/ticket-types"
                        className={({ isActive }) =>
                            isActive
                                ? "text-primary text-sm font-bold leading-normal border-b-2 border-primary py-4 -my-4"
                                : "text-slate-500 dark:text-text-secondary hover:text-primary text-sm font-medium leading-normal transition-colors"
                        }
                    >
                        Loại Vé
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
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-lg shadow-primary/20"
                        onClick={onLogout}
                    >
                        <span className="truncate">Logout</span>
                    </button>
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-border-dark ml-2"
                        data-alt="User profile avatar"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBrrqMwbY3Buf5QZzFM1gD5BkgHBCXDju8WB4YbLhAnq4DXUbWbtRguyFjYC_fvOSJRmekb4BC9BV-WUD4DC5AqT8WtzH4LVQG-D2OtxVSGJ-3vTz_o1ZpSmvbwT3puVIHQoQdWOEN6kn1HfdqBupvTTuKDc4O-FJVQWofUp4Km3-tIcPNhRiNbR_B_31dOp_GU-kxSg-2sAejmSfxDugsG_iB2GsBNYdt_1tutMmqI0KmNgDzoYkOYlhike9MwMISSviks0Oyq3LI")',
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
