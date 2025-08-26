import React from 'react';
import { Steps } from 'antd';
import { useNavigate } from 'react-router-dom';

interface VideoNavigationProps {
    currentStep: string;
    userStatus: any;
}

const VideoNavigation: React.FC<VideoNavigationProps> = ({ currentStep, userStatus }) => {
    const navigate = useNavigate();

    const steps = [
        {
            title: 'Early Life',
            key: 'early',
            route: '/video/early',
            enabled: true,
            completed: !!userStatus?.review1_stage
        },
        {
            title: 'Review 1',
            key: 'review1',
            route: '/video/review1',
            enabled: !!userStatus?.review1_stage,
            completed: !!userStatus?.prof_speech_stage
        },
        {
            title: 'Professional Life',
            key: 'professional',
            route: '/video/professional',
            enabled: !!userStatus?.prof_speech_stage,
            completed: !!userStatus?.review2_stage
        },
        {
            title: 'Review 2',
            key: 'review2',
            route: '/video/review2',
            enabled: !!userStatus?.review2_stage,
            completed: !!userStatus?.curr_speech_stage
        },
        {
            title: 'Current Life',
            key: 'current',
            route: '/video/current',
            enabled: !!userStatus?.curr_speech_stage,
            completed: !!userStatus?.review3_stage
        },
        {
            title: 'Review 3',
            key: 'review3',
            route: '/video/review3',
            enabled: !!userStatus?.review3_stage,
            completed: !!userStatus?.stage3
        }
    ];

    const currentIndex = steps.findIndex(step => step.key === currentStep);

    const handleStepClick = (stepIndex: number) => {
        const step = steps[stepIndex];
        if (step.enabled) {
            navigate(step.route);
        }
    };

    return (
        <div className="mb-2 p-0">
            <Steps
                current={currentIndex}
                className="mb-6 cursor-pointer"
                onChange={handleStepClick}
                items={steps.map((step, index) => ({
                    title: step.title,
                    status: step.completed ? 'finish' : (index === currentIndex ? 'process' : 'wait'),
                    disabled: !step.enabled
                }))}
            />
        </div>
    );
};

export default VideoNavigation;