import { Outlet } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import ThemeToggle from "../ThemeToggle";

export default function AdminLayout() {

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden antialiased">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-4 lg:px-20 py-4">
                <Outlet />
            </main>
            <ThemeToggle className="fixed bottom-3 right-3 z-50" />
        </div>
    );
}
