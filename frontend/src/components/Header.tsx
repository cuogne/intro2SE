import React from 'react';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold tracking-tighter">
          CineMax
        </Link>

        {/* Search Bar - Giống thiết kế Main Page.png */}
        <div className="flex-1 max-w-2xl mx-8 relative">
          <input 
            type="text" 
            className="w-full border border-black rounded-sm py-2 pl-10 pr-4 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
        </div>

        {/* User Icon */}
        <Link to="/auth">
            <User className="w-8 h-8 text-black border border-black rounded-full p-1" />
        </Link>
      </div>
    </header>
  );
};

export default Header;