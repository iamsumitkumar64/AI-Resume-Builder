import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import ProfileForm from '../components/user_form/index.tsx';
import LayoutWrapper from '../components/Layout/index.tsx';
import useUserStatus from '../hooks/useUserStatus.tsx';

const MainPage: React.FC = () => {
    const { userStatus } = useUserStatus();
    const navigate = useNavigate();
    useEffect(() => {
        if (!userStatus) return;
        if (!userStatus.stage1) {
            if (userStatus.stage2) {
                navigate('/video');
            } else if (userStatus.stage3) {
                navigate('/confirm');
            }
        }
    }, [userStatus, navigate]);
    if (!userStatus || !userStatus.stage1) {
        return null;
    }
    return (
        <LayoutWrapper title="Profile">
            <ProfileForm />
        </LayoutWrapper>
    );
};

export default MainPage;