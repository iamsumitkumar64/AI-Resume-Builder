import React from 'react';
import { Button } from 'antd';
import { Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import LayoutWrapper from '../components/Layout/index.tsx';
import VideoNavigation from '../components/VideoNavigation/index.tsx';
import useUserStatus from '../hooks/useUserStatus';

const VideoPage: React.FC = () => {
    const { userStatus, loading, error } = useUserStatus();
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;
    if (error) return <>{error}</>;
    if (!userStatus?.stage2) return <Navigate to="/profile" replace />;

    const getCurrentStepFromURL = () => {
        const path = location.pathname;
        if (path.includes('/early')) return 'early';
        if (path.includes('/review1')) return 'review1';
        if (path.includes('/professional')) return 'professional';
        if (path.includes('/review2')) return 'review2';
        if (path.includes('/current')) return 'current';
        if (path.includes('/review3')) return 'review3';
        return 'overview';
    };

    const currentStep = getCurrentStepFromURL();
    const isOverview = currentStep === 'overview';

    const steps = [
        {
            title: 'Early Life',
            route: '/video/early',
            enabled: true,
            completed: userStatus?.review1_stage
        },
        {
            title: 'Review 1',
            route: '/video/review1',
            enabled: userStatus?.review1_stage,
            completed: userStatus?.prof_speech_stage
        },
        {
            title: 'Professional Life',
            route: '/video/professional',
            enabled: userStatus?.prof_speech_stage,
            completed: userStatus?.review2_stage
        },
        {
            title: 'Review 2',
            route: '/video/review2',
            enabled: userStatus?.review2_stage,
            completed: userStatus?.curr_speech_stage
        },
        {
            title: 'Current Life',
            route: '/video/current',
            enabled: userStatus?.curr_speech_stage,
            completed: userStatus?.review3_stage
        },
        {
            title: 'Review 3',
            route: '/video/review3',
            enabled: userStatus?.review3_stage,
            completed: false
        }
    ];

    const getNextStep = () => {
        return steps.find(step => step.enabled && !step.completed);
    };

    const nextStep = getNextStep();

    return (
        <LayoutWrapper title="Video Section">
            <VideoNavigation
                currentStep={currentStep}
                userStatus={userStatus}
            />
            {isOverview ? (
                <div className="max-w-2xl mx-auto p-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Video Recording Overview</h2>
                        <p className="text-gray-600">Complete your video journey step by step</p>
                    </div>
                    {nextStep && (
                        <>
                            <Button
                                type="primary"
                                size="large"
                                className='flex m-auto justify-center bg-blue-600'
                                onClick={() => navigate(nextStep.route)}
                            >
                                Continue to {nextStep.title}
                            </Button>
                        </>
                    )}
                </div>
            ) :
                <div className='max-h-[70vh] overflow-y-scroll'>
                    <Outlet />
                </div>

            }
        </LayoutWrapper>
    );
};

export default VideoPage;