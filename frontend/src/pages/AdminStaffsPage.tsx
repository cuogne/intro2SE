import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Pagination, ConfigProvider, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getAllStaff, createStaff, updateStaff, toggleStaffStatus, deleteStaff } from "../services/staffService";
import type { StaffItem } from "../services/staffService";
import { useTheme } from "../context/ThemeContext";

export default function AdminStaffsPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [staffData, setStaffData] = useState<StaffItem[]>([]);
    const [totalStaff, setTotalStaff] = useState(0);
    const [currentEnd, setCurrentEnd] = useState(0);
    const { isDarkTheme } = useTheme();

    const pageSize = 5;

    // modal / form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
    const [form] = Form.useForm();

    // Load staff data from API
    const loadStaffData = async () => {
        try {
            setLoading(true);
            const result = await getAllStaff({
                search: search.trim() || undefined,
                role: roleFilter && roleFilter !== "all" ? roleFilter : undefined,
                page: currentPage,
                limit: pageSize,
            });
            setStaffData(result.staffs);
            setTotalStaff(result.total);
            setCurrentEnd(Math.min(currentPage * pageSize, result.total));
        } catch (error: any) {
            message.error(error.response?.data?.message || "Không thể tải danh sách nhân viên");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStaffData();
    }, [search, roleFilter, currentPage]);

    const openAddModal = () => {
        setEditingStaff(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (staff: StaffItem) => {
        setEditingStaff(staff);
        form.setFieldsValue({ ...staff });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleFormFinish = async (values: any) => {
        try {
            setLoading(true);
            if (editingStaff) {
                await updateStaff(editingStaff._id, values);
                message.success("Cập nhật nhân viên thành công");
            } else {
                await createStaff(values);
                message.success("Thêm nhân viên thành công");
                setCurrentPage(1);
            }
            setIsModalOpen(false);
            loadStaffData();
        } catch (error: any) {
            message.error(error.response?.data?.error || error.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleLock = async (id: string) => {
        try {
            await toggleStaffStatus(id);
            message.success("Cập nhật trạng thái tài khoản thành công");
            loadStaffData();
        } catch (error: any) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa nhân viên này?",
            okText: "Xóa",
            cancelText: "Hủy",
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await deleteStaff(id);
                    message.success("Xóa nhân viên thành công");
                    loadStaffData();
                } catch (error: any) {
                    message.error(error.response?.data?.message || "Có lỗi xảy ra");
                }
            },
        });
    };

    const formatLastLogin = (lastLogin?: string) => {
        if (!lastLogin) return "Chưa đăng nhập";
        const date = new Date(lastLogin);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        if (minutes < 1) return "vừa mới";
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 30) return `${days} ngày trước`;
        return `${months} tháng trước`;
    };

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý tài khoản nhân viên</h1>
                    <p className="text-slate-500 dark:text-text-secondary text-sm">Quản lý danh sách nhân viên, phân quyền vai trò và theo dõi trạng thái hoạt động của tài khoản.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-primary group hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-primary/25 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                    <span>Thêm nhân viên mới</span>
                </button>
            </div>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: isDarkTheme() ? "#111318" : "#f8fafc",
                        colorBorder: isDarkTheme() ? "#2d3748" : "#e2e8f0",
                    },
                    algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}
            >
                <div className="flex-1 overflow-y-auto">
                    <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6">
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-border-dark">
                            <div className="flex flex-1 w-full lg:w-auto gap-3 flex-col sm:flex-row">
                                <div className="flex-1 min-w-[280px]">
                                    <Input.Search
                                        placeholder="Tìm kiếm theo tên, email hoặc mã NV..."
                                        prefix={<SearchOutlined className="text-slate-400" />}
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        allowClear
                                        size="large"
                                    />
                                </div>

                                <div className="w-full sm:w-[200px]">
                                    <Select
                                        placeholder="Lọc theo vai trò"
                                        value={roleFilter || undefined}
                                        onChange={(value) => {
                                            setRoleFilter(value || "");
                                            setCurrentPage(1);
                                        }}
                                        size="large"
                                        style={{ width: "100%" }}
                                        allowClear
                                        options={[
                                            { value: "all", label: "Tất cả vai trò" },
                                            { value: "manager", label: "Quản lý" },
                                            { value: "cashier", label: "Thu ngân" },
                                            { value: "usher", label: "Soát vé" },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:bg-surface-dark dark:border-border-dark shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark">
                                        <tr>
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92a4c9]">Nhân viên</th>
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92a4c9]">Mã NV</th>
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92a4c9]">Vai trò</th>
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92a4c9]">Trạng thái</th>
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92a4c9]">Đăng nhập cuối</th>
                                            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92a4c9] text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-[#92a4c9]">
                                                    Đang tải...
                                                </td>
                                            </tr>
                                        ) : staffData.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-[#92a4c9]">
                                                    Không tìm thấy nhân viên nào
                                                </td>
                                            </tr>
                                        ) : (
                                            staffData.map((staff) => (
                                                <tr key={staff._id} className="group hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={
                                                                    "size-10 rounded-full bg-cover bg-center " +
                                                                    (staff.avatar ? "" : "flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800")
                                                                }
                                                                data-alt={`Avatar of ${staff.name}`}
                                                                style={staff.avatar ? { backgroundImage: `url('${staff.avatar}')` } : undefined}
                                                            >
                                                                {!staff.avatar && staff.initials && <span className="text-sm font-bold">{staff.initials}</span>}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{staff.name}</span>
                                                                <span className="text-xs text-slate-500 dark:text-[#92a4c9]">{staff.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-[#92a4c9]">{staff.code}</td>
                                                    <td className="py-4 px-6">
                                                        <div
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                                                                staff.role === "manager"
                                                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                                                    : staff.role === "cashier"
                                                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                                                    : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                                                            }`}
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">
                                                                {staff.role === "manager" ? "manage_accounts" : staff.role === "cashier" ? "point_of_sale" : "confirmation_number"}
                                                            </span>
                                                            {staff.role === "manager" ? "Quản lý" : staff.role === "cashier" ? "Thu ngân" : "Soát vé"}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className={`inline-flex items-center gap-1.5 ${staff.status === "locked" ? "opacity-60" : ""}`}>
                                                            <span className="relative flex h-2.5 w-2.5">
                                                                {staff.status === "active" ? (
                                                                    <>
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                                                    </>
                                                                ) : (
                                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                                                )}
                                                            </span>
                                                            <span className="text-sm text-slate-700 dark:text-white">{staff.status === "active" ? "Hoạt động" : "Đã khóa"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-[#92a4c9]">{formatLastLogin(staff.lastLogin)}</td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(staff)}
                                                                className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-border-dark/50 transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                                            </button>
                                                            {staff.status === "locked" ? (
                                                                <button
                                                                    onClick={() => handleToggleLock(staff._id)}
                                                                    className="p-2 rounded-lg text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                                    title="Mở khóa tài khoản"
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleToggleLock(staff._id)}
                                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                                    title="Khóa tài khoản"
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">lock_open</span>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(staff._id)}
                                                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                                title="Xóa nhân viên"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318]">
                                <div className="text-sm text-slate-500 dark:text-text-secondary">
                                    Hiển thị {currentPage <= totalStaff ? currentPage : 0} - {currentEnd <= totalStaff ? currentEnd : 0} của {totalStaff} nhân viên
                                </div>
                                <Pagination
                                    current={currentPage}
                                    total={totalStaff}
                                    pageSize={pageSize}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal open={isModalOpen} title={editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"} onCancel={handleCancel} onOk={() => form.submit()} okText="Lưu" cancelText="Hủy">
                    <Form form={form} layout="vertical" onFinish={handleFormFinish} initialValues={{ role: "cashier", status: "active" }}>
                        <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Nhập tên" }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Nhập email" },
                                { type: "email", message: "Email không hợp lệ" },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="code" label="Mã NV" rules={[{ required: true, message: "Nhập mã NV" }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}>
                            <Select
                                options={[
                                    { value: "manager", label: "Quản lý" },
                                    { value: "cashier", label: "Thu ngân" },
                                    { value: "usher", label: "Soát vé" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item name="status" label="Trạng thái">
                            <Select
                                options={[
                                    { value: "active", label: "Hoạt động" },
                                    { value: "locked", label: "Đã khóa" },
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </ConfigProvider>
        </div>
    );
}
