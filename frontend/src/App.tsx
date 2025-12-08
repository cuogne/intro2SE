import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-black bg-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;