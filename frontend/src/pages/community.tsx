import HeaderComp from '../components/headerMenu';
import backend_url from '../Libs/env';
import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, message, Avatar, Badge, Tooltip } from 'antd';
import Modal_ProfileViewer from '../components/profile_Modal';
import type { rawData } from '../schema/allAdmins';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const CommunityPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [allusers, setAllUsers] = useState<any[]>([]);
    const [selectedProfile_Data, setselectedProfile_Data] = useState<any>(null);
    const [selectedProfile_Email, setselectedProfile_Email] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch(`${backend_url}/admin/ApprovedUsers`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            const users = data.users || [];

            const enriched = await Promise.all(
                users.map(async (user: rawData) => {
                    try {
                        const resProfile = await fetch(
                            `${backend_url}/admin/user/profile/${user.id}`,
                            { credentials: 'include' }
                        );
                        if (!resProfile.ok) return user;
                        const profile = await resProfile.json();
                        return {
                            ...user,
                            profilePhoto: profile.data?.profilePhoto,
                            firstName: profile.data?.firstName,
                            middleName: profile.data?.middleName,
                            lastName: profile.data?.lastName,
                        };
                    } catch {
                        return user;
                    }
                })
            );
            setAllUsers(enriched);
        } catch (err) {
            messageApi.error('Error fetching user data');
        }
    }, [messageApi]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleViewProfile = async (id: string) => {
        try {
            const res = await fetch(`${backend_url}/admin/user/profile/${id}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error('Could not load profile');
            setselectedProfile_Data(data.data);
            setselectedProfile_Email(data.data?.email || '');
            setModalOpen(true);
        } catch (err) {
            message.error('Failed to load profile');
        }
    };

    return (
        <>
            {contextHolder}
            <HeaderComp title_of_page={'Community'} />
            <Modal_ProfileViewer
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                profileData={selectedProfile_Data}
                profileEmail={selectedProfile_Email}
            />

            <div style={{ padding: 20 }}>
                <Row gutter={[16, 16]}>
                    {allusers.map((user) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
                            <Badge.Ribbon
                                text={user.active ? 'Active' : 'Inactive'}
                                color={user.active ? 'green' : 'volcano'}
                            >
                                <Card
                                    hoverable
                                    onClick={() => handleViewProfile(user.id)}
                                    className="rounded-3xl border-gray-700 text-center bg-gradient-to-bl from-purple-200 to-blue-200 hover:border-blue-200"
                                >
                                    <Badge.Ribbon
                                        text={user.role == 'user' ? 'user' : 'admin'}
                                        color='blue'
                                    ></Badge.Ribbon>
                                    <Avatar
                                        size={80}
                                        src={
                                            user.profilePhoto
                                                ? `${backend_url}/upload/${user.email}/${user.profilePhoto}`
                                                : undefined
                                        }
                                        icon={<UserOutlined />}
                                        className="mx-auto mb-3 border border-blue-500"
                                    />
                                    <h2 className="mt-2 text-xl font-semibold">
                                        {[user.firstName, user.middleName, user.lastName]
                                            .filter(Boolean)
                                            .join(' ') || 'Unknown User'}
                                    </h2>
                                    <Tooltip title={user.email}>
                                        <p className="truncate">
                                            <MailOutlined /> {user.email}
                                        </p>
                                    </Tooltip>
                                    <Tooltip title={user.mobile}>
                                        <p><PhoneOutlined /> {user.mobile}</p>
                                    </Tooltip>
                                </Card>
                            </Badge.Ribbon>
                        </Col>
                    ))}
                </Row>
            </div >
        </>
    );
};

export default CommunityPage;