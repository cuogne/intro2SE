import React, { useState } from 'react';
import { User } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(true); // Mặc định hiển thị tab Đăng ký như hình

  return (
    <div className="flex flex-col items-center pt-10 pb-20">
      <div className="mb-6">
         {/* Icon User to ở giữa */}
        <User className="w-16 h-16 border-2 border-black rounded-full p-2" />
      </div>

      {/* Toggle Buttons */}
      <div className="flex border border-gray-300 rounded mb-8 overflow-hidden">
        <button 
          onClick={() => setIsRegister(false)}
          className={`px-6 py-2 text-sm font-medium ${!isRegister ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          Đăng nhập
        </button>
        <button 
          onClick={() => setIsRegister(true)}
          className={`px-6 py-2 text-sm font-medium ${isRegister ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          Đăng ký
        </button>
      </div>

      {/* Form Fields */}
      <div className="w-full max-w-md space-y-4 px-4">
        <div>
            <label className="block text-sm font-bold mb-2">Tên tài khoản</label>
            <input 
                type="text" 
                placeholder="Placeholder"
                className="w-full border-2 border-black rounded p-3 focus:outline-none"
            />
        </div>

        <div>
            <label className="block text-sm font-bold mb-2">Mật khẩu</label>
            <input 
                type="password" 
                placeholder="Placeholder"
                className="w-full border-2 border-black rounded p-3 focus:outline-none"
            />
        </div>

        {isRegister && (
            <div>
                <label className="block text-sm font-bold mb-2">Nhập lại mật khẩu</label>
                <input 
                    type="password" 
                    placeholder="Placeholder"
                    className="w-full border-2 border-black rounded p-3 focus:outline-none"
                />
            </div>
        )}

        <div className="pt-4 flex justify-center">
            <button className="bg-black text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors">
                {isRegister ? 'Đăng ký' : 'Đăng nhập'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;