import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import AdminShowtimePage from "./pages/AdminShowtimePage";
import AdminStaffsPage from "./pages/AdminStaffsPage";
import AdminMoviePage from "./pages/AdminMoviePage";
import AdminCinemaPage from "./pages/AdminCinemaPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPaymentPage from "./pages/AdminPaymentPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import UserLayout from "./components/layouts/UserLayout";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<UserLayout />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/seats/:showtimeId" element={<SeatSelectionPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/bookings" element={<BookingHistoryPage />} />
          <Route path="/booking/:bookingId" element={<BookingDetailPage />} />

        </Route>
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
          <Route path="showtimes" element={<AdminShowtimePage />} />
          <Route path="movies" element={<AdminMoviePage />} />
          <Route path="staff" element={<AdminStaffsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="payments" element={<AdminPaymentPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
