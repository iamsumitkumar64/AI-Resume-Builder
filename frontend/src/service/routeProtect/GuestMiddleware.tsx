import { Navigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import SessionStore from '../../store/sessionStore';
import useUserStatus from '../../hooks/useUserStatus';

interface Props {
    children: React.ReactElement;
}

const GuestMiddleware = ({ children }: Props) => {
    const session = SessionStore((state) => state.session);
    const init = SessionStore((state) => state.init);
    const [loading, setLoading] = useState(true);
    const { userStatus } = useUserStatus();
    const location = useLocation();

    useEffect(() => {
        const load = async () => {
            await init();
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return null;
    if (session) {
        if (session?.role == 'user') {
            if (userStatus?.stage3 && (location.pathname === '/video' || location.pathname === '/profile')) {
                return <Navigate to="/confirm" replace />;
            }
            if (userStatus?.stage2 && (location.pathname === '/confirm' || location.pathname === '/profile')) {
                return <Navigate to="/video" replace />;
            }
        }
        return <Navigate to="/community" replace />;
    }
    return children;
};

export default GuestMiddleware;