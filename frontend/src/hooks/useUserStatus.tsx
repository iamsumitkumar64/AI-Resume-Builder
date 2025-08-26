import { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../Libs/env';
import type { UserStatus } from '../schema/authSchema';

const useUserStatus = () => {
    const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserStatus = async () => {
        try {
            setError(null);
            const response = await axios.get(`${backend_url}/user/status`, {
                withCredentials: true
            });
            setUserStatus(response.data);
        } catch (error) {
            console.error('Failed to fetch user status:', error);
            setError('Failed to fetch user status');
        } finally {
            setLoading(false);
        }
    };

    const refreshUserStatus = () => {
        setLoading(true);
        fetchUserStatus();
    };

    useEffect(() => {
        fetchUserStatus();
    }, []);

    return {
        userStatus,
        loading,
        error,
        refreshUserStatus
    };
};

export default useUserStatus;