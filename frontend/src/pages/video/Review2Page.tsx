import React from 'react';
import { Navigate } from 'react-router-dom';
import ProfessionalLifeForm from '../../components/Prof_form/index.tsx';
import useUserStatus from '../../hooks/useUserStatus';

const Review2Page: React.FC = () => {
    const { userStatus, loading, error, refreshUserStatus } = useUserStatus();

    if (loading) return <div>Loading...</div>;
    if (error) return <>{error}</>;
    if (!userStatus?.stage2) return <Navigate to="/profile" replace />;
    if (!userStatus?.review2_stage) return <Navigate to="/video/professional" replace />;
    return (
        <ProfessionalLifeForm
            onFormSubmit={refreshUserStatus}
            nextRoute="/video/current"
        />
    );
};

export default Review2Page;