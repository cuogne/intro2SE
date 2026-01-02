import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// ...existing code...
import AdminLayout from "./components/layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminLogoutPage from "./pages/AdminLogoutPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import AdminShowtimePage from "./pages/AdminShowtimePage";
import AdminStaffsPage from "./pages/AdminStaffsPage";
import AdminMoviePage from "./pages/AdminMoviePage";
import AdminTicketType from "./pages/AdminTicketType";
import AdminCinemaPage from "./pages/AdminCinemaPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPaymentPage from "./pages/AdminPaymentPage";

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
                            <Route index element={<Navigate to="movies" replace />} />
                            <Route path="cinema-rooms" element={<AdminCinemaPage />} />
                            <Route path="ticket-types" element={<AdminTicketType />} />
                            <Route path="showtimes" element={<AdminShowtimePage />} />
                            <Route path="movies" element={<AdminMoviePage />} />
                            <Route path="staff" element={<AdminStaffsPage />} />
                            <Route path="users" element={<AdminUsersPage />} />
                            <Route path="payments" element={<AdminPaymentPage />} />
                            <Route path="logout" element={<AdminLogoutPage />} />
                        </Route>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
