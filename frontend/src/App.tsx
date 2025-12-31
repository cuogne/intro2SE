import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// ...existing code...
import RoomManagementPage from "./pages/RoomManagementPage";
import TicketTypeManagementPage from "./pages/TicketTypeManagementPage";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminLogoutPage from "./pages/AdminLogoutPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import ShowtimeManagementPage from "./pages/ShowtimeManagementPage";
import MovieManagementPage from "./pages/MovieManagementPage";
import AdminStaffsPage from "./pages/AdminStaffsPage";

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen font-sans bg-background-light dark:bg-[#111318] text-slate-900 dark:text-white">
                <main className="grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/movies" element={<MoviesPage />} />
                        <Route path="/movie/:id" element={<MovieDetailPage />} />
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminLayout />
                                </AdminRoute>
                            }
                        >
                            <Route index element={<Navigate to="ticket-types" replace />} />
                            <Route path="cinema-rooms" element={<RoomManagementPage />} />
                            <Route path="ticket-types" element={<TicketTypeManagementPage />} />
                            <Route path="showtimes" element={<ShowtimeManagementPage />} />
                            <Route path="movies" element={<MovieManagementPage />} />
                            <Route path="staff" element={<AdminStaffsPage />} />
                            <Route path="logout" element={<AdminLogoutPage />} />
                        </Route>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
