import React from 'react';
import backend_url from '../Libs/env';
import AuthForm from '../components/AuthForm/index.tsx';
import { useNavigate } from 'react-router';

const Login: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <AuthForm
                title="Welcome To AI Resume Builder"
                buttonText="Log In"
                api={`${backend_url}/auth/login`}
                redirectTo='/'
                showContactAdmin={true}
                contactAdminAction={() => navigate('/admin_Contact')}
            />
        </>
    );
};

export default Login;