import type { ReactNode } from 'react';
import { Layout, Button, Typography, Space } from 'antd';
import { LoginOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

interface PageLayoutProps {
    pageTitle: string;
    icon?: ReactNode;
    children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ pageTitle, icon = <TeamOutlined className="text-blue-800 text-xl" />, children }) => {
    const navigate = useNavigate();

    return (
        <Layout className="bg-transparent">
            <Header className="flex justify-between items-center p-6 bg-transparent">
                <Space>
                    {icon}
                    <Title level={4} className="!text-blue-900 !mb-0" style={{ fontFamily: 'outfit' }}>
                        {pageTitle}
                    </Title>
                </Space>
                <Button
                    icon={<LoginOutlined />}
                    type="primary"
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Login
                </Button>
            </Header>
            <Content className="p-6 flex justify-center">
                <div className="w-[80vw]">{children}</div>
            </Content>
        </Layout>
    );
};

export default PageLayout;