import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const AuthPage: React.FC = () => {
    const { user, loading: authLoading, login } = useAuth();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const [isRegister, setIsRegister] = useState(mode !== "login");
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate("/");
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const currentMode = searchParams.get("mode");
        setIsRegister(currentMode !== "login");
    }, [searchParams]);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (authLoading || user) {
        return null;
    }

    // Xử lý khi nhập liệu
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Xử lý Submit
    const handleSubmit = async () => {
        setError(""); // Reset lỗi cũ

        if (!formData.username || !formData.password) {
            setError("Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.");
            return;
        }
        try {
            if (isRegister) {
                // Logic Đăng ký
                if (!formData.email) {
                    setError("Vui lòng nhập Email.");
                    return;
                }

                if (formData.password !== formData.confirmPassword) {
                    setError("Mật khẩu nhập lại không khớp!");
                    return;
                }
                await authService.register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                });
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                setIsRegister(false); // Chuyển sang tab đăng nhập
                setFormData({ username: "", email: "", password: "", confirmPassword: "" });
            } else {
                // Logic Đăng nhập
                const res = await authService.login({
                    username: formData.username,
                    password: formData.password,
                });
                if (res.success && res.data) {
                    login(res.data.user, res.data.accessToken, res.data.refreshToken);
                }
                navigate("/");
            }
        } catch (err: any) {
            console.error(err);
            const serverMsg = err.response?.data?.message;
            const errorMap: Record<string, string> = {
                'Username already exists': 'Tên tài khoản đã tồn tại',
                'Email already exists': 'Email đã tồn tại',
                'Username or password is incorrect': 'Tài khoản hoặc mật khẩu không chính xác',
                'All fields are required: username, email, password': 'Vui lòng nhập đầy đủ tên tài khoản, email và mật khẩu',
                'Username and password are required': 'Vui lòng nhập tên tài khoản và mật khẩu',
                'Username must be between 3 and 15 characters': 'Tên tài khoản phải từ 3 đến 15 ký tự',
                'Password must be between 6 and 20 characters': 'Mật khẩu phải từ 6 đến 20 ký tự',
                'Invalid email format': 'Email không đúng định dạng',
                'Username can only contain letters, numbers, and underscores': 'Tên tài khoản chỉ được chứa chữ, số và dấu gạch dưới',
            };
            setError(errorMap[serverMsg] || serverMsg || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <div className="flex flex-col items-center pt-3 pb-30">
            <div className="mb-6">
                <User className="w-16 h-16 border-2 border-slate-900 dark:border-white rounded-full p-2 text-slate-900 dark:text-white" />
            </div>

            <div className="flex border border-slate-300 dark:border-border-dark rounded mb-8 overflow-hidden bg-slate-100 dark:bg-[#232f48]">
                <button
                    onClick={() => {
                        setIsRegister(true);
                        setError("");
                        navigate("/auth?mode=register");
                    }}
                    className={`px-6 py-2 text-sm font-medium cursor-pointer transition-colors ${isRegister ? "bg-primary text-white" : "bg-transparent text-slate-600 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    Đăng ký
                </button>
                <button
                    onClick={() => {
                        setIsRegister(false);
                        setError("");
                        navigate("/auth?mode=login");
                    }}
                    className={`px-6 py-2 text-sm font-medium cursor-pointer transition-colors ${!isRegister ? "bg-primary text-white" : "bg-transparent text-slate-600 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    Đăng nhập
                </button>
            </div>

            <div className="w-full max-w-md space-y-4 px-4">
                {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm text-center font-bold bg-red-100 dark:bg-red-500/20 p-3 rounded border border-red-300 dark:border-red-500/50">{error}</div>
                )}

                {/* Username Input */}
                <div className="relative">
                    <label className="block text-sm font-bold mb-2 text-slate-900 dark:text-white">Tên tài khoản</label>
                    <div className="relative">
                        <input
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nhập tên tài khoản"
                            className="w-full bg-white dark:bg-[#232f48] border-2 border-slate-300 dark:border-[#324467] text-slate-900 dark:text-white rounded p-3 pl-10 focus:outline-none focus:border-primary placeholder:text-slate-400 dark:placeholder:text-text-secondary"
                        />
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-text-secondary" />
                    </div>
                </div>

                {/* Email Input - CHỈ HIỆN KHI ĐĂNG KÝ */}
                {isRegister && (
                    <div className="relative">
                        <label className="block text-sm font-bold mb-2 text-slate-900 dark:text-white">Email</label>
                        <div className="relative">
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="w-full bg-white dark:bg-[#232f48] border-2 border-slate-300 dark:border-[#324467] text-slate-900 dark:text-white rounded p-3 pl-10 focus:outline-none focus:border-primary placeholder:text-slate-400 dark:placeholder:text-text-secondary"
                            />
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-text-secondary" />
                        </div>
                    </div>
                )}

                {/* Password Input */}
                <div className="relative">
                    <label className="block text-sm font-bold mb-2 text-slate-900 dark:text-white">Mật khẩu</label>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            className="w-full bg-white dark:bg-[#232f48] border-2 border-slate-300 dark:border-[#324467] text-slate-900 dark:text-white rounded p-3 pl-10 pr-10 focus:outline-none focus:border-primary placeholder:text-slate-400 dark:placeholder:text-text-secondary"
                        />
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-text-secondary" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 dark:text-text-secondary hover:text-slate-600 dark:hover:text-white cursor-pointer">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password - CHỈ HIỆN KHI ĐĂNG KÝ */}
                {isRegister && (
                    <div className="relative">
                        <label className="block text-sm font-bold mb-2 text-slate-900 dark:text-white">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Xác nhận mật khẩu"
                                className="w-full bg-white dark:bg-[#232f48] border-2 border-slate-300 dark:border-[#324467] text-slate-900 dark:text-white rounded p-3 pl-10 pr-10 focus:outline-none focus:border-primary placeholder:text-slate-400 dark:placeholder:text-text-secondary"
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-text-secondary" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-slate-400 dark:text-text-secondary hover:text-slate-600 dark:hover:text-white cursor-pointer">
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {formData.confirmPassword && (
                            <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {formData.password === formData.confirmPassword ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                            </p>
                        )}
                    </div>
                )}

                <div className="pt-4 flex justify-center">
                    <button onClick={handleSubmit} className="bg-primary text-white px-8 py-3 rounded font-medium hover:bg-primary/90 transition-colors cursor-pointer w-full md:w-auto">
                        {isRegister ? "Đăng ký" : "Đăng nhập"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
