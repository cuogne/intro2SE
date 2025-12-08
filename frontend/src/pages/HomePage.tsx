import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold mb-6">CineMax</h1>
      <p className="text-xl text-gray-800 mb-12">
        Hệ thống quản lý rạp phim hiện đại của HCMUS
      </p>
      
      <Link to="/movies"> 
        <button className="bg-black text-white px-8 py-3 text-lg font-medium rounded hover:bg-gray-800 transition-colors cursor-pointer">
          Đặt vé ngay
        </button>
      </Link>
    </div>
  );
};

export default HomePage;