import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, message, ConfigProvider, theme, Pagination, Spin } from "antd";
import { getAllUsers, updateUser } from "../services/userService";
import type { UserItem } from "../services/userService";
import { useTheme } from "../context/ThemeContext";

export default function AdminUsersPage() {
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const [isLoading, setIsLoading] = useState(false);

    const { isDarkTheme } = useTheme();

    const [users, setUsers] = useState<UserItem[]>([]);

    // modal/form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [form] = Form.useForm();

    const load = async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (e: any) {
            console.error(e);
            message.error("Không thể tải danh sách người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openEditModal = (u: UserItem) => {
        setEditingUser(u);
        form.setFieldsValue({ username: u.username, email: u.email, role: u.role });
        setIsModalOpen(true);
    };

    const handleCancel = () => setIsModalOpen(false);

    const handleFormFinish = async (values: any) => {
        if (!editingUser) return;
        const id = editingUser._id;

        try {
            await updateUser(id, values);
            load();
            message.success("Cập nhật người dùng thành công");
        } catch (e: any) {
            console.warn("Update user API failed, kept local update", e);
            message.warning("Cập nhật người dùng thất bại");
        }

        setIsModalOpen(false);
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return users.filter((u) => {
            const matches = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u._id.includes(q);
            const matchesRole = !roleFilter || roleFilter === "all" || u.role === roleFilter;
            return matches && matchesRole;
        });
    }, [users, query, roleFilter]);

    const total = filtered.length;
    const pageItems = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    const start = total === 0 ? 0 : currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, total);

    const getInitials = (username: string) => {
        return username.slice(0, 2).toUpperCase();
    };

    const getAvatarColor = (username: string) => {
        const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-indigo-500", "bg-teal-500"];
        const index = username.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý tài khoản người dùng</h1>
                    <p className="text-slate-500 dark:text-text-secondary text-sm">Xem và chỉnh sửa thông tin tài khoản người dùng.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-4 shadow-sm">
                <ConfigProvider
                    theme={{
                        token: {
                            colorBgContainer: isDarkTheme() ? "#111318" : "#f8fafc",
                            colorText: isDarkTheme() ? "#fff" : "#000",
                            colorBorder: isDarkTheme() ? "#2d3748" : "#e2e8f0",
                        },
                        algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }}
                >
                    <div className="flex items-center gap-3 flex-col sm:flex-row">
                        <Input
                            placeholder="Tìm kiếm theo username, email hoặc id..."
                            prefix={<span className="material-symbols-outlined text-slate-400">search</span>}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="flex-1 min-w-[220px]"
                            style={{ padding: "8px" }}
                        />

                        <Select
                            value={roleFilter}
                            onChange={(value) => {
                                setRoleFilter(value);
                                setCurrentPage(0);
                            }}
                            className="w-full sm:w-[180px]"
                            style={{ padding: "8px" }}
                            placeholder="Lọc theo vai trò"
                            options={[
                                { value: "all", label: "Tất cả vai trò" },
                                { value: "user", label: "User" },
                                { value: "admin", label: "Admin" },
                            ]}
                        />
                    </div>
                </ConfigProvider>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:bg-surface-dark dark:border-border-dark shadow-sm">
                <div className="overflow-x-auto">
                    <Spin spinning={isLoading} tip="Đang tải...">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-[#111318] border-b border-slate-200 dark:border-border-dark">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Username</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Vai trò</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Tạo lúc</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {pageItems.map((u) => (
                                    <tr key={u._id} className="group hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-10 rounded-full ${getAvatarColor(u.username)} flex items-center justify-center text-white font-semibold text-sm`}>
                                                    {getInitials(u.username)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{u.username}</span>
                                                    <span className="text-xs text-slate-500 dark:text-[#92a4c9]">{u._id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-[#92a4c9]">{u.email}</td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-border-dark text-slate-800 dark:text-slate-300">
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500 dark:text-[#92a4c9]">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-border-dark/50 transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Spin>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318]">
                    <div className="text-sm text-slate-500 dark:text-[#92a4c9]">
                        Hiển thị {start}-{end} trong số {total} người dùng
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
                        <Pagination current={currentPage + 1} pageSize={pageSize} total={total} onChange={(page) => setCurrentPage(page - 1)} showSizeChanger={false} />
                    </ConfigProvider>
                </div>
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
                <Modal open={isModalOpen} title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"} onCancel={handleCancel} onOk={() => form.submit()} okText="Lưu" cancelText="Hủy">
                    <Form form={form} layout="vertical" onFinish={handleFormFinish} initialValues={{ role: "user" }}>
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

                        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}>
                            <Select
                                options={[
                                    { value: "user", label: "User" },
                                    { value: "admin", label: "Admin" },
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </ConfigProvider>
        </div>
    );
}
