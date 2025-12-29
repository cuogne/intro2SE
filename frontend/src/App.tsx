import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import TicketPage from './pages/TicketPage';

function App() {
  return (
    <Router>
      <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col transition-colors">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/seats/:showtimeId" element={<SeatSelectionPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/bookings" element={<BookingHistoryPage />} />
            <Route path="/ticket/:bookingId" element={<TicketPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;