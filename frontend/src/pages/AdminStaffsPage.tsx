import { useMemo, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
export default function AdminStaffsPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);

    const pageSize = 5;

    const initialStaffs = [
        {
            id: "1",
            name: "Nguyễn Thị Mai",
            email: "mai.nguyen@theater.com",
            code: "NV-0042",
            role: "cashier",
            status: "active",
            lastLogin: "2 giờ trước",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqgzIpha0-b3lRt17K33d_gZwgog5kQC3hQQZvhOAlN57HyJWXNqFCfa1fwPLSdtDMpPGHqOL0Ee9VXLAOFOoen7Yk6YiZgTHHrOURUrQcX5q3gcSwPDUWrDWnjwyH9gDV3Nh4s1aNjr7b2kJdFeljNgE_EZOzGiSXP8ItLdjLoSDZI3rVLeBFDgK_5YDoGlpsg1F20WQL6mSiAdvEec8BoT6vrdADKCy0gohe8ouQ9atNeirXrEJhKTUaJ4sp",
        },
        {
            id: "2",
            name: "Trần Văn Nam",
            email: "nam.tran@theater.com",
            code: "QL-0012",
            role: "manager",
            status: "active",
            lastLogin: "1 ngày trước",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDja2ffjryMahqHJFadthHI5sBWZhIh_qmMR2Bgcodf_4nNp-KzOyGGizUiD2qjEDF1QAyMZ9CY5fcnN6mr-FzNuRG4oXx5YZw8F8Zwp7EtTL7KsakjtISsT3Zu5k-j5lw_GWQLncAQsi5aZ5jpVvqkc60KtadEh8Fe9BtEN6DszBaZMjk-CqPx_55eu_YjACrjQA_6xYElMgdK53LZ8vCoPemPrdD4XRFftQqL5V6qy2bDbav7viokOf6BfqnYXfhKv6hu_D00W1Q",
        },
        {
            id: "3",
            name: "Lê Thị Bình",
            email: "binh.le@theater.com",
            code: "NV-0056",
            role: "usher",
            status: "locked",
            lastLogin: "1 tháng trước",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAghzXZowzWrYChzRo9LKEhF7gxUUrWnPdxVZE5CnomT5-2J0tPxWU_vtQZT5zpieo3TSU-b1u_e0anqV7YH6e5z0KlOPTxs8R-X0JeKXAvkpHBb539-Z1lZS1sKzKykc7u2E_uW-P5NAmLulev7-b40ZkG2QSEqOgndQ24W9plzyhvPz7R0eZR1bWvFNArV8g2YXhK9enUk5mz61Amz4oQfHFcJedCQD7gKb6U7HbiWU5iSijn9EpUoGXY6WGZnuTg4usAbnvb_FY",
        },
        {
            id: "4",
            name: "Phạm Tuấn Kiệt",
            email: "kiet.pham@theater.com",
            code: "NV-0089",
            role: "cashier",
            status: "active",
            lastLogin: "5 phút trước",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCibgNErUc0anIMsYqtSbesVKyWB5GIkxqr2J0sk6hA3xy11LPTIPBjHEwqGVem211TCW1PyxEdO2eLIB8UbApce1QvBQClbmz93hL5aE7gdOub9WJ_7VwEQfE4dH5dwhvwJ5HxrAURpM_RctJWy2-63AUK6phLBDFG3Tz4HXBFuPGaW6BjDDIKLcPu-aW_6A6u0sEFFrRAEclfHHjA1Hjyvz_kIIKxBqH9n6K-fWaZ5IEztFo3-VDZnn1KG8BUL8KmzWQ9gOloUR4",
        },
        {
            id: "5",
            name: "Hoàng Ngọc",
            email: "ngoc.hoang@theater.com",
            code: "NV-0102",
            role: "usher",
            status: "active",
            lastLogin: "3 ngày trước",
            initials: "HN",
        },
        {
            id: "6",
            name: "Nguyễn Văn A",
            email: "a.nguyen@theater.com",
            code: "NV-0110",
            role: "cashier",
            status: "active",
            lastLogin: "4 ngày trước",
            initials: "NA",
        },
        {
            id: "7",
            name: "Trần Thị B",
            email: "b.tran@theater.com",
            code: "NV-0111",
            role: "manager",
            status: "active",
            lastLogin: "5 ngày trước",
            initials: "TB",
        },
        {
            id: "8",
            name: "Phan C",
            email: "c.phan@theater.com",
            code: "NV-0112",
            role: "usher",
            status: "locked",
            lastLogin: "2 tháng trước",
            initials: "PC",
        },
    ];

    const [staffData, setStaffData] = useState(initialStaffs);

    // modal / form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any | null>(null);
    const [form] = Form.useForm();

    const openAddModal = () => {
        setEditingStaff(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (staff: any) => {
        setEditingStaff(staff);
        form.setFieldsValue({ ...staff });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleFormFinish = (values: any) => {
        if (editingStaff) {
            setStaffData((prev) => prev.map((s) => (s.id === editingStaff.id ? { ...s, ...values } : s)));
            message.success("Cập nhật nhân viên thành công");
        } else {
            const newStaff = { id: Date.now().toString(), ...values, lastLogin: "vừa mới" };
            setStaffData((prev) => [newStaff, ...prev]);
            setCurrentPage(0);
            message.success("Thêm nhân viên thành công");
        }
        setIsModalOpen(false);
    };

    const toggleLock = (id: string) => {
        setStaffData((prev) => prev.map((s) => (s.id === id ? { ...s, status: s.status === "locked" ? "active" : "locked" } : s)));
        message.success("Cập nhật trạng thái tài khoản");
    };

    const filteredStaffs = useMemo(() => {
        const q = search.trim().toLowerCase();
        return staffData.filter((s) => {
            const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
            const matchesRole = !roleFilter || roleFilter === "all" || s.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [search, roleFilter, staffData]);

    const total = filteredStaffs.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const pageStaffs = filteredStaffs.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    const start = total === 0 ? 0 : currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, total);

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
            <div className="flex-1 overflow-y-auto">
                <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-border-dark">
                        <div className="flex flex-1 w-full lg:w-auto gap-3 flex-col sm:flex-row">
                            <div className="relative flex-1 min-w-[280px]">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">search</span>
                                <input
                                    className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white rounded-lg h-11 pl-10 pr-4 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                                    placeholder="Tìm kiếm theo tên, email hoặc mã NV..."
                                    type="text"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(0);
                                    }}
                                />
                            </div>

                            <div className="relative w-full sm:w-[180px]">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">filter_list</span>
                                <select
                                    className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white rounded-lg h-11 pl-10 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm cursor-pointer transition-all"
                                    value={roleFilter}
                                    onChange={(e) => {
                                        setRoleFilter(e.target.value);
                                        setCurrentPage(0);
                                    }}
                                >
                                    <option disabled={true} value="">
                                        Lọc theo vai trò
                                    </option>
                                    <option value="all">Tất cả vai trò</option>
                                    <option value="manager">Quản lý</option>
                                    <option value="cashier">Thu ngân</option>
                                    <option value="usher">Soát vé</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
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
                                    {pageStaffs.map((staff) => (
                                        <tr key={staff.id} className="group hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors">
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
                                            <td className="py-4 px-6 text-sm text-slate-500 dark:text-[#92a4c9]">{staff.lastLogin}</td>
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
                                                            onClick={() => toggleLock(staff.id)}
                                                            className="p-2 rounded-lg text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                            title="Mở khóa tài khoản"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">lock</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => toggleLock(staff.id)}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title="Khóa tài khoản"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">lock_open</span>
                                                        </button>
                                                    )}
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
                                trong số <span className="font-medium text-slate-900 dark:text-white">{total}</span> nhân viên
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-[#92a4c9] hover:bg-slate-50 dark:hover:bg-border-dark/50 disabled:opacity-50 transition-colors"
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
                                {totalPages > 5 && <span className="px-2 text-slate-400 dark:text-slate-600">...</span>}
                                <button
                                    className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-[#92a4c9] hover:bg-slate-50 dark:hover:bg-border-dark/50 transition-colors"
                                    disabled={currentPage >= totalPages - 1}
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                                >
                                    Tiếp theo
                                </button>
                            </div>
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
        </div>
    );
}
