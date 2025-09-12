import React from 'react';
import { Navigate } from 'react-router-dom';
import EarlyLifeForm from '../../components/Early_form/index.tsx';
import useUserStatus from '../../hooks/useUserStatus';

const Review1Page: React.FC = () => {
    const { userStatus, loading, error, refreshUserStatus } = useUserStatus();

    if (loading) return <div>Loading...</div>;
    if (error) return <>{error}</>;
    if (!userStatus?.stage2) return <Navigate to="/profile" replace />;
    if (!userStatus?.review1_stage) return <Navigate to="/video/early" replace />;
    return (
        <EarlyLifeForm
            onFormSubmit={refreshUserStatus}
            nextRoute="/video/professional"
        />
    );
};

export default Review1Page;