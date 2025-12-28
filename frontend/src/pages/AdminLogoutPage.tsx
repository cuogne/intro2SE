import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogoutPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        // Thực hiện logout và chuyển sang /auth
        logout();
        const t = setTimeout(() => navigate("/auth"), 800);
        return () => clearTimeout(t);
    }, [navigate, logout]);

    return (
        <div className="max-w-[900px] mx-auto py-20 text-center">
            <h2 className="text-2xl font-bold mb-3">Đăng xuất</h2>
            <p className="text-slate-500 mb-6">Bạn sẽ được chuyển sang trang đăng nhập.</p>
            <button
                onClick={() => {
                    logout();
                    navigate("/auth");
                }}
                className="px-4 py-2 bg-primary text-white rounded-md"
            >
                Đi tới trang đăng nhập
            </button>
        </div>
    );
}
