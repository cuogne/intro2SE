import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { getAllUsers, updateUser } from "../services/userService";
import type { UserItem } from "../services/userService";

export default function AdminUsersPage() {
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const [users, setUsers] = useState<UserItem[]>([]);

    // modal/form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (e: any) {
                console.error(e);
                message.error("Không thể tải danh sách người dùng");
            }
        };
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
        // optimistic UI update
        setUsers((prev) => prev.map((p) => (p._id === id ? { ...p, ...values, updatedAt: new Date().toISOString() } : p)));

        try {
            await updateUser(id, values);
            message.success("Cập nhật người dùng thành công");
        } catch (e: any) {
            console.warn("Update user API failed, kept local update", e);
            message.warning("Không thể lưu lên server — cập nhật cục bộ thành công");
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
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const pageItems = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    const start = total === 0 ? 0 : currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, total);

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Quản lý tài khoản người dùng</h1>
                    <p className="text-slate-500 dark:text-text-secondary text-sm">Xem và chỉnh sửa thông tin tài khoản người dùng (username, email, vai trò).</p>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-4 shadow-sm">
                <div className="flex items-center gap-3 flex-col sm:flex-row">
                    <div className="relative flex-1 min-w-[220px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">search</span>
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-border-dark rounded-lg h-11 pl-10 pr-4 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            placeholder="Tìm kiếm theo username, email hoặc id..."
                        />
                    </div>

                    <div className="relative w-full sm:w-[180px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">filter_list</span>
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-border-dark rounded-lg h-11 pl-10 pr-8 appearance-none text-sm"
                        >
                            <option value="">Lọc theo vai trò</option>
                            <option value="all">Tất cả vai trò</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">expand_more</span>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:bg-surface-dark dark:border-border-dark shadow-sm">
                <div className="overflow-x-auto">
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
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{u.username}</span>
                                            <span className="text-xs text-slate-500 dark:text-[#92a4c9]">{u._id}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-[#92a4c9]">{u.email}</td>
                                    <td className="py-4 px-6 text-sm">{u.role}</td>
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
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111318]">
                    <div className="text-sm text-slate-500 dark:text-[#92a4c9]">
                        Hiển thị{" "}
                        <span className="font-medium text-slate-900 dark:text-white">
                            {start}-{end}
                        </span>{" "}
                        trong số <span className="font-medium text-slate-900 dark:text-white">{total}</span> người dùng
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-[#92a4c9] hover:bg-slate-50 dark:hover:bg-border-dark/50 disabled:opacity-50"
                            disabled={currentPage <= 0}
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages })
                            .slice(0, 5)
                            .map((_, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-1.5 rounded-md ${
                                        i === currentPage
                                            ? "bg-primary text-white hover:bg-blue-600"
                                            : "border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-[#92a4c9] hover:bg-slate-50 dark:hover:bg-border-dark/50"
                                    }`}
                                    onClick={() => setCurrentPage(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        <button
                            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-[#92a4c9] hover:bg-slate-50 dark:hover:bg-border-dark/50"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>

            <Modal open={isModalOpen} title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"} onCancel={handleCancel} onOk={() => form.submit()} okText="Lưu" cancelText="Hủy">
                <Form form={form} layout="vertical" onFinish={handleFormFinish} initialValues={{ role: "user" }}>
                    <Form.Item name="username" label="Username" rules={[{ required: true, message: "Nhập username" }]}>
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
        </div>
    );
}
