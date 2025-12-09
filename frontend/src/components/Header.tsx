import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth(); // Lấy user và hàm logout
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/auth'); // Quay về trang đăng nhập
  };

  return (
    <header className="border-b border-gray-200 py-4 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold tracking-tighter">
          CineMax
        </Link>

        {/* User Area */}
        {user ? (
          // --- TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP ---
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="font-medium">Xin chào, <b>{user.username}</b></span>
              <User className="w-8 h-8 text-black border border-black rounded-full p-1" />
            </button>

            {/* Dropdown Menu nhỏ để Đăng xuất */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          // --- TRƯỜNG HỢP CHƯA ĐĂNG NHẬP ---
          <Link to="/auth">
              <User className="w-8 h-8 text-gray-500 border border-gray-300 rounded-full p-1 hover:text-black hover:border-black transition-colors" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;