import { useNavigate, Link } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-lg mb-6">Page not found</p>
            <button onClick={handleGoBack} className="px-6 py-3 w-30 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Quay lại
            </button>
            <Link to="/" className="mt-4 px-6 py-3 w-30 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Trang chủ
            </Link>
        </div>
    );
}
