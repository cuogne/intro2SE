import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface UserAvatarProps {
    size?: number;
    className?: string;
    showHoverEffect?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ size = 40, className = "", showHoverEffect = false }) => {
    return (
        <div className={`relative ${className}`}>
            <Avatar
                size={size}
                icon={<UserOutlined />}
                className={`border-2 border-primary shadow-lg ${showHoverEffect ? "group-hover:shadow-primary/50 group-hover:scale-110 transition-all duration-300" : ""}`}
            />
            {showHoverEffect && <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all duration-300"></div>}
        </div>
    );
};

export default UserAvatar;
