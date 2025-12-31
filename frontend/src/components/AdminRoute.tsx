import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface AdminRouteProps {
    children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { user } = useAuth();

    // Nếu chưa đăng nhập -> chuyển sang /auth
    // if (!user) return <Navigate to="/auth" replace />;

    // Nếu đã đăng nhập nhưng không phải admin -> chuyển sang /
    // if (user.role !== "admin") return <Navigate to="/" replace />;

    //test
    return <>{children}</>;
}
