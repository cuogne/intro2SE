import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">CineMax</h2>
          <p className="text-sm mb-2">Hệ thống quản lý rạp chiếu phim</p>
          <p className="text-sm">hiện đại của HCMUS</p>
        </div>
        
        <div>
          <h3 className="font-bold mb-4 text-lg">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="#">Trung tâm hỗ trợ</a></li>
            <li><a href="#">Liên hệ</a></li>
            <li><a href="#">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-lg">Công ty</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Báo chí</a></li>
          </ul>
        </div>

        <div className="flex gap-4 items-start">
           {/* Placeholder cho các icon tròn màu xám trong ảnh */}
           <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
           <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
           <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-12">
        © 2025 CineMax • Bản quyền thuộc về nhóm 09
      </div>
    </footer>
  );
};

export default Footer;