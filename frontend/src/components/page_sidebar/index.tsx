import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	FormOutlined,
	VideoCameraOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStatus from "../../hooks/useUserStatus";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
	const [collapsed, setCollapsed] = useState(true);
	const { userStatus } = useUserStatus();
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<Sider
			collapsed={collapsed}
			trigger={null}
			width={200}
			className="min-h-[90vh] bg-transparent border-r border-b border-black bg-blue-200"
		>
			<div className="flex flex-col h-full px-2 py-2">
				<Menu
					mode="inline"
					className="bg-transparent font-bold flex-1"
					selectedKeys={[location.pathname]}
				>
					<Menu.Item
						key="/profile"
						icon={<FormOutlined />}
						disabled={!userStatus?.stage1}
						onClick={() => navigate("/profile")}
						className={`rounded ${location.pathname === "/profile"
							? "bg-blue-500/20"
							: "hover:bg-white/10"
							}`}
					>
						Your Details
					</Menu.Item>

					<Menu.Item
						key="/video"
						icon={<VideoCameraOutlined />}
						disabled={!userStatus?.stage2}
						onClick={() => navigate("/video")}
						className={`rounded ${location.pathname === "/video"
							? "bg-blue-500/20"
							: "hover:bg-white/10"
							}`}
					>
						Your Videos
					</Menu.Item>

					<Menu.Item
						key="/confirm"
						icon={<CheckCircleOutlined />}
						disabled={!userStatus?.stage3}
						onClick={() => navigate("/confirm")}
						className={`rounded ${location.pathname === "/confirm"
							? "bg-blue-500/20"
							: "hover:bg-white/10"
							}`}
					>
						Confirm Details
					</Menu.Item>
				</Menu>

				<div className="flex justify-center pb-4">
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						className="text-2xl hover:text-blue-800"
					/>
				</div>
			</div>
		</Sider>
	);
};

export default Sidebar;