import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "../AdminHeader";

export default function AdminLayout() {
    const [query, setQuery] = useState("");
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return document.documentElement.classList.contains("dark");
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (isDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        try {
            localStorage.setItem("theme-dark", JSON.stringify(isDark));
        } catch {}
    }, [isDark]);

    const handleLogout = () => {
        // navigation to /admin/logout - actual logout logic to be implemented later
        navigate("/admin/logout");
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden">
            <AdminHeader query={query} setQuery={setQuery} isDark={isDark} setIsDark={setIsDark} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-background-dark p-4 lg:px-20 py-4">
                <Outlet />
            </main>
        </div>
    );
}
