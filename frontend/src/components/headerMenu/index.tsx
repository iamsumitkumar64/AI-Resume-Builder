import { Layout, Menu, Typography } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SessionStore from '../../store/sessionStore';
import type { HeaderProps } from '../../schema/props';

const { Header } = Layout;
const { Title } = Typography;

const HeaderComp: React.FC<HeaderProps> = ({ title_of_page }) => {
    const navigate = useNavigate();
    const session = SessionStore((state) => state.session);

    const handleClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'profile':
                navigate('/profile');
                break;
            case 'community':
                navigate('/community');
                break;
            case 'add-users':
                navigate('/adduser');
                break;
            case 'logout':
                navigate('/logout');
                break;
            default:
                break;
        }
    };
    return (
        <Header className="bg-transparent  flex items-center justify-between px-4 border-b !border-gray-950">
            <Title level={4} className="!text-blue-900 !mb-0"
                style={{ fontFamily: 'outfit' }} >
                {title_of_page.toLowerCase().includes('admin') && <UserOutlined className="mr-2" />}
                {title_of_page.toLowerCase().includes('community') && <TeamOutlined className="mr-2" />}
                {title_of_page}
            </Title>
            <Menu
                mode="horizontal"
                theme="light"
                onClick={handleClick}
                selectable={false}
                className="bg-transparent font-bold rounded-full ml-auto text-center"
            >
                <Menu.Item key="profile" icon={<UserOutlined />}
                    className="!text-black hover:!text-blue-500">
                    Profile
                </Menu.Item>
                {session?.role === 'admin' && (
                    <Menu.Item key="add-users" icon={<UserOutlined />}
                        className="!text-black hover:!text-blue-500">
                        Admin Panel
                    </Menu.Item>
                )}
                <Menu.Item key="community" icon={<TeamOutlined />}
                    className="!text-black hover:!text-blue-500">
                    Community
                </Menu.Item>
                <Menu.Item
                    key="logout"
                    icon={<LogoutOutlined />}
                    className="!text-black hover:!text-red-500"
                >
                    Logout
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default HeaderComp;