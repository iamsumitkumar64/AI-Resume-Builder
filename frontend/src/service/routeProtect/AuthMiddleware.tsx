import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import SessionStore from '../../store/sessionStore';

const AuthMiddleware = () => {
    const session = SessionStore((state) => state.session);
    const init = SessionStore((state) => state.init);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const load = async () => {
            await init();
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return null;
    if (!session) return <Navigate to="/login" replace />;

    const isAdmin = session.role === 'admin';
    if (isAdmin) {
        if (location.pathname === '/profile') {
            return <Navigate to="/community" replace />;
        }
        return <Outlet />;
    }
    if (location.pathname === '/adduser') {
        return <Navigate to="/profile" replace />;
    }
    return <Outlet />;
};

export default AuthMiddleware;