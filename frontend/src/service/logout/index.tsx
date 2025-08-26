import { useEffect } from 'react';
import axios from 'axios';
import backend_url from '../../Libs/env.tsx';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.get(`${backend_url}/auth/logout`, {
                    withCredentials: true,
                });
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                navigate('/login');
            }
        };
        logoutUser();
    }, [navigate]);

    return null;
};

export default LogOut;