import React from 'react';
import { Navigate } from 'react-router-dom';
import CurrentLifeForm from '../../components/current_form/index.tsx';
import useUserStatus from '../../hooks/useUserStatus';

const Review3Page: React.FC = () => {
    const { userStatus, loading, error, refreshUserStatus } = useUserStatus();

    if (loading) return <div>Loading...</div>;
    if (error) return <>{error}</>;
    if (!userStatus?.stage2) return <Navigate to="/profile" replace />;
    if (!userStatus?.review3_stage) return <Navigate to="/video/current" replace />;

    return (
        <CurrentLifeForm
            onFormSubmit={refreshUserStatus}
            nextRoute="/confirm"
        />
    );
};

export default Review3Page;