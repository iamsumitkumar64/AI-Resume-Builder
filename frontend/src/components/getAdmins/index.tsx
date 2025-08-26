import { useEffect, useState } from 'react';
import axios from 'axios';
import backend_url from '../../Libs/env.tsx';
import { Card, Row, Col, Typography, Spin, Empty, Avatar, Space, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { AdminSchema } from '../../schema/allAdmins.tsx';
import CustomModal from '../../components/CustomModals';

const { Text } = Typography;

const GetAllAdmins = () => {
    const [admins, setAdmins] = useState<AdminSchema[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${backend_url}/admin`, { withCredentials: true })
            .then((res) => setAdmins(res.data.allAdmins || []))
            .catch((err) => console.error('Fetching Admins failed:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Spin
                size="large"
                className="flex justify-center items-center h-[60vh]"
            />
        );
    }

    if (!admins.length) {
        return (
            <Empty
                description="No Admins Found"
                className="flex justify-center items-center h-[60vh]"
            />
        );
    }

    return (
        <Row gutter={[16, 16]} className="p-4">
            {admins.map((admin, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                    <Card
                        hoverable
                        className="bg-blue-300 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-blue-300"
                    >
                        <Space direction="vertical" align="center" className="text-center gap-2 w-full">
                            <Avatar
                                size={64}
                                icon={<UserOutlined />}
                                className="bg-blue-500"
                            />
                            <Text className="text-white hover:scale-105">{admin.email}</Text>
                            {admin.mobile && (
                                <Text className="text-white hover:scale-105">📱 {admin.mobile}</Text>
                            )}
                            <CustomModal title="Admin Info">
                                <Space direction="vertical" className="w-full">
                                    <Text className="font-semibold">📧 {admin.email}</Text>
                                    {admin.mobile && <Text className="font-medium">📱 {admin.mobile}</Text>}
                                    <Text><strong>Role:</strong> {admin.role}</Text>
                                    <Tag color={admin.active ? "green" : "red"}>
                                        {admin.active ? "Active" : "Inactive"}
                                    </Tag>
                                </Space>
                            </CustomModal>
                        </Space>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default GetAllAdmins;