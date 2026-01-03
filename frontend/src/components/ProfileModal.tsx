import React, { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, Button, message, Spin, ConfigProvider, theme } from "antd";
import { UserOutlined, LockOutlined, HistoryOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile, changePassword } from "../services/userService";
import type { UserItem } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface ProfileModalProps {
    open: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState("1");
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<UserItem | null>(null);
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const { isDarkTheme } = useTheme();

    useEffect(() => {
        if (open) {
            loadProfile();
        }
    }, [open]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserProfile();
            setProfile(data);
            profileForm.setFieldsValue({
                email: data.email,
            });
        } catch (error: any) {
            message.error(error.response?.data?.message || "Không thể tải thông tin người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (values: { email: string }) => {
        try {
            setLoading(true);
            const updatedUser = await updateUserProfile(values);
            setProfile(updatedUser);
            updateUser(updatedUser); // Update auth context
            message.success("Cập nhật thông tin thành công!");
        } catch (error: any) {
            message.error(error.response?.data?.message || "Cập nhật thông tin thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        try {
            setLoading(true);
            await changePassword(values);
            message.success("Đổi mật khẩu thành công!");
            passwordForm.resetFields();
        } catch (error: any) {
            message.error(error.response?.data?.error || error.response?.data?.message || "Đổi mật khẩu thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleViewBookingHistory = () => {
        onClose();
        navigate("/bookings");
    };

    const items = [
        {
            key: "1",
            label: (
                <span className="flex items-center gap-2">
                    <UserOutlined />
                    Thông tin cá nhân
                </span>
            ),
            children: (
                <div className="py-4">
                    {profile && (
                        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tài khoản ID:</p>
                            <p className="font-mono text-xs break-all">{profile._id}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tên người dùng:</p>
                            <p className="font-semibold">{profile.username}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Vai trò:</p>
                            <p className="font-semibold capitalize">{profile.role}</p>
                            {profile.createdAt && (
                                <>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Ngày tạo:</p>
                                    <p className="text-sm">{new Date(profile.createdAt).toLocaleString("vi-VN")}</p>
                                </>
                            )}
                        </div>
                    )}
                    <Form form={profileForm} layout="vertical" onFinish={handleUpdateProfile}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" },
                            ]}
                        >
                            <Input prefix={<UserOutlined />} type="email" placeholder="Email" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Cập nhật thông tin
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <span className="flex items-center gap-2">
                    <LockOutlined />
                    Đổi mật khẩu
                </span>
            ),
            children: (
                <div className="py-4">
                    <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
                        <Form.Item label="Mật khẩu hiện tại" name="currentPassword" rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" />
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                                { max: 20, message: "Mật khẩu không được quá 20 ký tự!" },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                        </Form.Item>
                        <Form.Item
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: "3",
            label: (
                <span className="flex items-center gap-2">
                    <HistoryOutlined />
                    Lịch sử đặt vé
                </span>
            ),
            children: (
                <div className="py-4 text-center">
                    <HistoryOutlined style={{ fontSize: 48, color: "#1890ff" }} className="mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Xem tất cả lịch sử đặt vé của bạn</p>
                    <Button type="primary" size="large" onClick={handleViewBookingHistory} icon={<HistoryOutlined />}>
                        Xem lịch sử đặt vé
                    </Button>
                </div>
            ),
        },
    ];

    return (
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
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <UserSwitchOutlined style={{ fontSize: 20 }} />
                        <span>Quản lý tài khoản</span>
                    </div>
                }
                open={open}
                onCancel={onClose}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Spin spinning={loading}>
                    <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
                </Spin>
            </Modal>
        </ConfigProvider>
    );
};

export default ProfileModal;
