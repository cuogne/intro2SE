import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
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

  return (
    <header className="sticky top-0 z-50 border-b border-solid border-b-[#232f48] bg-background-dark/95 backdrop-blur-md px-4 lg:px-10 py-3">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-white hover:text-primary transition-colors"
          >
            <div className="size-8 text-primary">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
              ABC Cinema
            </h2>
          </Link>
          {/* Desktop Search */}
          <div className="hidden md:flex flex-col min-w-[240px]">
            <form
              onSubmit={handleSearch}
              className="flex w-full flex-1 items-stretch rounded-lg h-10 bg-[#232f48] group focus-within:ring-2 focus-within:ring-primary/50 transition-all"
            >
              <div className="text-[#92a4c9] flex items-center justify-center pl-3">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex w-full min-w-0 flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder:text-[#92a4c9] px-3 text-sm font-normal"
                placeholder="Tìm phim, rạp..."
              />
            </form>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Navigation for logged in users */}
          {user && (
            <Link
              to="/bookings"
              className="hidden md:block text-white text-sm font-medium hover:text-primary transition-colors"
            >
              Lịch sử đặt vé
            </Link>
          )}
          {/* Actions */}
          <div className="flex gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                >
                  {user.username}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a2332] border border-[#232f48] rounded-lg shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#232f48]"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-transparent border border-[#232f48] text-white text-sm font-bold hover:bg-[#232f48] transition-colors">
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
  );
};

export default Header;
