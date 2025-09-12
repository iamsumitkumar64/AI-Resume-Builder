import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Menu, Button, Dropdown, message } from 'antd';
import {
    UserAddOutlined,
    UnorderedListOutlined,
    DownCircleTwoTone,
    UpCircleTwoTone,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import backend_url from '../Libs/env.tsx';
import AuthForm from '../components/AuthForm/index.tsx';
import HeaderComp from '../components/headerMenu/index.tsx';
import CustomTable from '../components/customtable/index.tsx';
import Modal_ProfileViewer from '../components/profile_Modal/index.tsx';
import type { rawData } from '../schema/allAdmins.tsx';
import { socket } from '../config/socket';

const { Sider, Content } = Layout;

const AdminPage: React.FC = () => {
    const [userData, setUserData] = useState<rawData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [msgApi, contextHolder] = message.useMessage();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProfile_Data, setselectedProfile_Data] = useState<any>(null);
    const [selectedProfile_Email, setselectedProfile_Email] = useState<string>('');
    const [selectedMenu, setSelectedMenu] = useState<string>('addUser');
    const [collapsed, setCollapsed] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${backend_url}/admin/allusers`, {
                credentials: 'include'
            });
            console.log(res);
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUserData(data.users || []);
        } catch (err) {
            msgApi.error("Error fetching user data");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [msgApi]);

    useEffect(() => {
        fetchUsers();
    }, [refreshTrigger, fetchUsers]);

    useEffect(() => {
        const handleCameToApprove = ({ userId }: { userId: string }) => {
            setUserData(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, sentforapproval: true, approvedByAdmin: 0 }
                        : user
                )
            );
        };

        socket.on("CameToApprove", handleCameToApprove);
        return () => {
            socket.off("CameToApprove", handleCameToApprove);
        };
    }, []);

    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${backend_url}/admin/user/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error("Failed to delete user");
            msgApi.success("User deleted successfully");
        } catch (err) {
            msgApi.error("Error deleting user");
            console.error("Delete error:", err);
        } finally {
            triggerRefresh();
        }
    };

    const handleActiveornot = async (id: string) => {
        try {
            const res = await fetch(`${backend_url}/admin/user/activate/${id}`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to toggle activation");
            msgApi.success(data.message);
        } catch (err: any) {
            msgApi.error(err.message || "Failed to toggle activation");
            console.error("Request error:", err);
        } finally {
            triggerRefresh();
        }
    };

    const handleapprove = async (id: string) => {
        try {
            const res = await fetch(`${backend_url}/admin/user/approve/${id}`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to Approve Profile");
            msgApi.success(data.message);
        } catch (err: any) {
            msgApi.error(err.message || "Failed to Approve");
            console.error("Request error:", err);
        } finally {
            triggerRefresh();
        }
    };

    const handlereject = async (id: string) => {
        try {
            const res = await fetch(`${backend_url}/admin/user/reject/${id}`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to Reject Profile");
            msgApi.success(data.message);
        } catch (err: any) {
            msgApi.error(err.message || "Failed to Reject");
            console.error("Request error:", err);
        } finally {
            triggerRefresh();
        }
    };

    const handleViewProfile = async (id: string) => {
        try {
            const res = await fetch(`${backend_url}/admin/user/profile/${id}`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error("Could not load profile");
            setselectedProfile_Data(data.data);
            setselectedProfile_Email(data.data.email);
            setModalOpen(true);
        } catch (err) {
            message.error("Failed to load profile");
        }
    };

    const handleUserAdded = useCallback(() => {
        msgApi.success("User created successfully");
        triggerRefresh();
    }, []);

    const coldata = [
        {
            title: "Role",
            dataIndex: "role",
            key: "role"
        },
        {
            title: "Email",
            key: "email",
            render: (_: any, record: rawData) => {
                if (!record.email) return 'No Email';
                return (
                    <a href={`mailto:${record.email}`} className='text-blue-400 hover:underline'>
                        {record.email}
                    </a>
                );
            }
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile"
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: Date) => new Date(date).toLocaleString()
        },
        {
            title: "Approval Request",
            key: "approvalRequest",
            filters: [
                { text: "Approved", value: "approved" },
                { text: "Rejected", value: "rejected" },
                { text: "Pending", value: "pending" },
                { text: "Blacklisted", value: "blacklisted" },
            ],
            onFilter: (value: any, record: rawData) => {
                if (value === "blacklisted") return record.rejectionCount > 2;
                if (value === "approved") return record.approvedByAdmin === 1;
                if (value === "rejected") return record.approvedByAdmin === 2;
                if (value === "pending") return record.approvedByAdmin === 0 && record.sentforapproval;
                return true;
            },
            render: (_: any, record: rawData) => {
                if (record.rejectionCount > 2) return 'BlackListed';

                if (!record.sentforapproval) return 'request not sent';

                const menu = (
                    <Menu className='text-center'>
                        <Menu.Item
                            key="check"
                            className="!text-blue-600 hover:!bg-blue-600 hover:!text-white"
                            onClick={() => handleViewProfile(record.id)}
                        >
                            Check Profile
                        </Menu.Item>
                        {record.approvedByAdmin == 0 && (
                            <>
                                <Menu.Item
                                    key="approve"
                                    className="!text-green-600 hover:!bg-green-600 hover:!text-white"
                                    onClick={() => handleapprove(record.id)}
                                >
                                    Approve
                                </Menu.Item>
                                <Menu.Item
                                    key="reject"
                                    className="!text-red-600 hover:!bg-red-600 hover:!text-white"
                                    onClick={() => handlereject(record.id)}
                                >
                                    Reject
                                </Menu.Item>
                            </>
                        )}
                    </Menu>
                );

                return (
                    <Dropdown
                        overlay={menu}
                        trigger={['click']}
                        onVisibleChange={(visible) => {
                            setOpenDropdownId(visible ? record.id : null);
                        }}
                    >
                        <div className='text-center'>
                            {record.approvedByAdmin === 2 && <p className="text-red-600 font-semibold m-0">Rejected</p>}
                            {record.approvedByAdmin === 1 && <p className="text-green-600 font-semibold m-0">Approved</p>}
                            {record.approvedByAdmin === 0 && <p className="text-yellow-600 font-semibold m-0">Pending</p>}
                            <Button type="link">
                                Actions {openDropdownId === record.id ? <UpCircleTwoTone /> : <DownCircleTwoTone />}
                            </Button>
                        </div>
                    </Dropdown>
                );
            }
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: rawData) => {
                const menu = (
                    <Menu className='text-center'>
                        <Menu.Item key="delete" danger onClick={() => handleDelete(record.id)}>
                            Delete
                        </Menu.Item>
                        <Menu.Item
                            key="toggle"
                            onClick={() => handleActiveornot(record.id)}
                            className="!text-blue-600 hover:!bg-blue-600 hover:!text-white"
                        >
                            {record.active ? 'InActive' : 'Active'}
                        </Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown
                        overlay={menu}
                        trigger={['click']}
                        onVisibleChange={(visible) => {
                            setOpenDropdownId(visible ? record.id : null);
                        }}
                    >
                        <Button type="link">
                            Actions {openDropdownId === record.id ? <UpCircleTwoTone /> : <DownCircleTwoTone />}
                        </Button>
                    </Dropdown>
                );
            }
        }
    ];

    return (
        <Layout className='h-screen'>
            {contextHolder}
            <HeaderComp title_of_page={'Admin Panel'} />
            <Layout>
                <Sider
                    collapsed={collapsed}
                    width={220}
                    className="bg-transparent border-r border-b border-black bg-blue-200"
                >
                    <div className="flex flex-col justify-between px-2 py-2 h-full">
                        <Menu
                            mode="inline"
                            selectedKeys={[selectedMenu]}
                            onClick={(e) => setSelectedMenu(e.key)}
                            className="bg-transparent font-bold"
                        >
                            <Menu.Item
                                key="addUser"
                                icon={<UserAddOutlined />}
                                className={`rounded ${selectedMenu === "addUser"
                                    ? "bg-blue-500/20"
                                    : "hover:bg-white/10"
                                    }`}
                            >
                                Add User
                            </Menu.Item>

                            <Menu.Item
                                key="userList"
                                icon={<UnorderedListOutlined />}
                                className={`rounded ${selectedMenu === "userList"
                                    ? "bg-blue-500/20"
                                    : "hover:bg-white/10"
                                    }`}
                            >
                                User List
                            </Menu.Item>
                        </Menu>

                        <div className="flex justify-center mt-auto pb-4">
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                className="text-xl hover:text-blue-800"
                            />
                        </div>
                    </div>
                </Sider>
                <Layout style={{ padding: '20px' }}>
                    <Content>
                        {selectedMenu === 'addUser' && (
                            <AuthForm
                                title=""
                                buttonText="Add User"
                                api={`${backend_url}/admin/user`}
                                showContactAdmin={false}
                                onSuccess={handleUserAdded}
                            />
                        )}

                        {selectedMenu === 'userList' && (
                            <CustomTable
                                columns={coldata}
                                data={userData}
                                loading={loading}
                            />
                        )}
                    </Content>
                </Layout>
            </Layout>

            <Modal_ProfileViewer
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                profileData={selectedProfile_Data}
                profileEmail={selectedProfile_Email}
            />
        </Layout>
    );
};

export default AdminPage;