import { Outlet } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import Header from "../Header";
import Footer from "../Footer";

export default function UserLayout() {
    return (
        <div className="relative flex h-screen w-full flex-col overflow-y-auto antialiased">
            <Header />
            <main className="flex-1 bg-slate-50 dark:bg-background-dark p-4 lg:px-20 py-4">
                <Outlet />
            </main>
            <Footer />
            <ThemeToggle className="fixed bottom-3 right-3 z-50" />
        </div>
    );
}
