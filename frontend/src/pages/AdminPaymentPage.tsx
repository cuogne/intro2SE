import { useEffect, useState } from "react";
import { Modal, Pagination, Spin, ConfigProvider, theme, Descriptions } from "antd";
import { fetchAllBookings, type BookingItem } from "../services/bookingService";
import { useTheme } from "../context/ThemeContext";

const PAGE_SIZE = 10;

export default function AdminPaymentPage() {
    const { isDarkTheme } = useTheme();
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const data = await fetchAllBookings();
            setBookings(data);
        } catch (error) {
            console.error("Error loading bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (booking: BookingItem) => {
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        return `${dd}/${mm}/${yyyy} - ${hh}:${min}`;
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("vi-VN") + " đ";
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-green-500/10 text-emerald-700 dark:text-green-400 border border-emerald-200 dark:border-green-500/20">
                        Thành công
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20">
                        Đang xử lý
                    </span>
                );
            case "cancelled":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                        Đã hủy
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20">
                        {status}
                    </span>
                );
        }
    };

    const getPaymentProviderDisplay = (provider?: string) => {
        if (!provider) return "N/A";
        switch (provider.toLowerCase()) {
            case "momo":
                return "Momo";
            case "zalopay":
                return "ZaloPay";
            default:
                return provider;
        }
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentBookings = bookings.slice(startIndex, endIndex);

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý giao dịch</h1>
                    <p className="text-slate-500 dark:text-text-secondary text-sm">Theo dõi doanh thu và lịch sử thanh toán của khách hàng</p>
                </div>
                <button className="flex items-center gap-2 group bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-primary/25 transition-all active:scale-95">
                    <span className="material-symbols-outlined group-hover:scale-105 transition-transform">download</span>
                    Xuất báo cáo
                </button>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5 lg:col-span-6">
                        <label className="block text-slate-500 dark:text-text-secondary text-xs font-medium mb-1.5 ml-1">Từ khóa</label>
                        <div className="relative group">
                            <input
                                className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary block p-2.5 pl-10 placeholder:text-slate-400 dark:placeholder:text-text-secondary transition-all"
                                placeholder="Tìm kiếm mã GD, tên khách hàng..."
                                type="text"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-text-secondary group-focus-within:text-primary">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-3 lg:col-span-2">
                        <label className="block text-slate-500 dark:text-text-secondary text-xs font-medium mb-1.5 ml-1">Thời gian</label>
                        <div className="relative">
                            <select className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary block p-2.5 pl-9 appearance-none cursor-pointer">
                                <option>Tháng này</option>
                                <option>Hôm nay</option>
                                <option>Tuần này</option>
                                <option>Tháng trước</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 dark:text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-2">
                        <label className="block text-slate-500 dark:text-text-secondary text-xs font-medium mb-1.5 ml-1">Phương thức</label>
                        <div className="relative">
                            <select className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary block p-2.5 pl-9 appearance-none cursor-pointer">
                                <option>Tất cả</option>
                                <option>Momo</option>
                                <option>Visa/Master</option>
                                <option>Tiền mặt</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 dark:text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">credit_card</span>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-2">
                        <label className="block text-slate-500 dark:text-text-secondary text-xs font-medium mb-1.5 ml-1">Trạng thái</label>
                        <div className="relative">
                            <select className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary block p-2.5 pl-9 appearance-none cursor-pointer">
                                <option>Tất cả</option>
                                <option>Thành công</option>
                                <option>Đang xử lý</option>
                                <option>Thất bại</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 dark:text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 border border-slate-200 dark:border-border-dark flex items-center gap-4 shadow-sm">
                        <div className="size-12 rounded-full bg-green-500/20 dark:bg-green-500/10 flex items-center justify-center text-green-500 dark:text-green-400">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-text-secondary text-xs font-medium">Tổng doanh thu (Tháng)</p>
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold">452.8M đ</h3>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 border border-slate-200 dark:border-border-dark flex items-center gap-4 shadow-sm">
                        <div className="size-12 rounded-full bg-primary/20 dark:bg-primary/10 flex items-center justify-center text-primary dark:text-primary">
                            <span className="material-symbols-outlined">receipt</span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-text-secondary text-xs font-medium">Tổng giao dịch</p>
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold">1,245</h3>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 border border-slate-200 dark:border-border-dark flex items-center gap-4 shadow-sm">
                        <div className="size-12 rounded-full bg-purple-500/20 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400">
                            <span className="material-symbols-outlined">confirmation_number</span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-text-secondary text-xs font-medium">Vé đã bán</p>
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold">3,890</h3>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 border border-slate-200 dark:border-border-dark flex items-center gap-4 shadow-sm">
                        <div className="size-12 rounded-full bg-orange-500/20 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 dark:text-orange-400">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-text-secondary text-xs font-medium">Khách hàng mới</p>
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold">128</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-lg flex flex-col">
                <Spin spinning={loading} tip="Đang tải...">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark">
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Mã GD</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Khách hàng</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Thời gian</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Phương thức</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider text-right">Tổng tiền</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider text-center">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider text-center w-20">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark text-sm">
                                {currentBookings.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-text-secondary">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    currentBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors group">
                                            <td className="p-4">
                                                <span className="font-mono text-primary font-medium">{booking.paymentTransId || "N/A"}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-slate-900 dark:text-white font-medium">{booking.user}</span>
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-text-secondary">{formatDateTime(booking.bookedAt)}</td>
                                            <td className="p-4">
                                                <span className="text-slate-900 dark:text-white">{getPaymentProviderDisplay(booking.paymentProvider)}</span>
                                            </td>
                                            <td className="p-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(booking.totalPrice)}</td>
                                            <td className="p-4 text-center">{getStatusBadge(booking.status)}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleViewDetails(booking)}
                                                    className="text-slate-400 hover:text-primary dark:hover:text-primary transition-colors p-1 hover:bg-slate-100 dark:hover:bg-border-dark rounded"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Spin>

                <div className="px-4 py-3 bg-slate-50 dark:bg-[#111318] border-t border-slate-200 dark:border-border-dark flex items-center justify-between">
                    <div className="text-sm text-slate-500 dark:text-text-secondary">
                        Hiển thị <span className="font-medium text-slate-900 dark:text-white">{startIndex + 1}</span> -{" "}
                        <span className="font-medium text-slate-900 dark:text-white">{Math.min(endIndex, bookings.length)}</span> trong số{" "}
                        <span className="font-medium text-slate-900 dark:text-white">{bookings.length}</span> kết quả
                    </div>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorBgContainer: isDarkTheme() ? "#212f4d" : "#dddfe1",
                                colorText: isDarkTheme() ? "#fff" : "#000",
                            },
                            algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        }}
                    >
                        <Pagination current={currentPage} pageSize={PAGE_SIZE} total={bookings.length} onChange={(page) => setCurrentPage(page)} showSizeChanger={false} />
                    </ConfigProvider>
                </div>
            </div>

            {/* Detail Modal */}
            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: isDarkTheme() ? "#1a1f2e" : "#fff",
                        colorText: isDarkTheme() ? "#fff" : "#000",
                        colorBorder: isDarkTheme() ? "#2d3748" : "#e2e8f0",
                    },
                    algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}
            >
                <Modal
                    title={<span className="text-slate-900 dark:text-white text-lg font-bold">Chi tiết giao dịch</span>}
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={null}
                    width={700}
                >
                    {selectedBooking && (
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Mã giao dịch">{selectedBooking.paymentTransId || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Khách hàng">{selectedBooking.user}</Descriptions.Item>
                            <Descriptions.Item label="Phim">{selectedBooking.movie}</Descriptions.Item>
                            <Descriptions.Item label="Rạp">{selectedBooking.cinema}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{selectedBooking.address}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian chiếu">{formatDateTime(selectedBooking.startTime)}</Descriptions.Item>
                            <Descriptions.Item label="Ghế ngồi">{selectedBooking.seat.join(", ")}</Descriptions.Item>
                            <Descriptions.Item label="Số lượng">{selectedBooking.quantity}</Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">{formatCurrency(selectedBooking.totalPrice)}</Descriptions.Item>
                            <Descriptions.Item label="Phương thức thanh toán">{getPaymentProviderDisplay(selectedBooking.paymentProvider)}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">{getStatusBadge(selectedBooking.status)}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian đặt">{formatDateTime(selectedBooking.bookedAt)}</Descriptions.Item>
                            {selectedBooking.paidAt && <Descriptions.Item label="Thời gian thanh toán">{formatDateTime(selectedBooking.paidAt)}</Descriptions.Item>}
                            {selectedBooking.paymentMeta?.momoTransId && <Descriptions.Item label="Momo Trans ID">{selectedBooking.paymentMeta.momoTransId}</Descriptions.Item>}
                        </Descriptions>
                    )}
                </Modal>
            </ConfigProvider>
        </div>
    );
}
