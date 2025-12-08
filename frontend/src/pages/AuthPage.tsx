import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // Xử lý khi nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Xử lý Submit
  const handleSubmit = async () => {
    setError(''); // Reset lỗi cũ
    try {
        if (isRegister) {
            // Logic Đăng ký
            if (formData.password !== formData.confirmPassword) {
                setError("Mật khẩu nhập lại không khớp!");
                return;
            }
            await authService.register({
                username: formData.username,
                password: formData.password
            });
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            setIsRegister(false); // Chuyển sang tab đăng nhập
        } else {
            // Logic Đăng nhập
            await authService.login({
                username: formData.username,
                password: formData.password
            });
            alert("Đăng nhập thành công!");
            navigate('/'); // Chuyển về trang chủ
        }
    } catch (err: any) {
        console.error(err);
        // Hiển thị lỗi từ backend trả về (nếu có)
        setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 pb-20">
      <div className="mb-6">
        <User className="w-16 h-16 border-2 border-black rounded-full p-2" />
      </div>

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

      <div className="w-full max-w-md space-y-4 px-4">
        {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
        
        <div>
            <label className="block text-sm font-bold mb-2">Tên tài khoản</label>
            <input 
                name="username"
                type="text" 
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên tài khoản"
                className="w-full border-2 border-black rounded p-3 focus:outline-none"
            />
        </div>

        <div>
            <label className="block text-sm font-bold mb-2">Mật khẩu</label>
            <input 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full border-2 border-black rounded p-3 focus:outline-none"
            />
        </div>

        {isRegister && (
            <div>
                <label className="block text-sm font-bold mb-2">Nhập lại mật khẩu</label>
                <input 
                    name="confirmPassword"
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Xác nhận mật khẩu"
                    className="w-full border-2 border-black rounded p-3 focus:outline-none"
                />
            </div>
        )}

        <div className="pt-4 flex justify-center">
            <button 
                onClick={handleSubmit}
                className="bg-black text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
                {isRegister ? 'Đăng ký' : 'Đăng nhập'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;