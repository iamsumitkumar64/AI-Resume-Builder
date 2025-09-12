import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import VideoRecorderUploader from '../../components/videoComp/index.tsx';
import useUserStatus from '../../hooks/useUserStatus';
import backend_url from '../../Libs/env';
import { socket } from '../../config/socket.tsx';
import SessionStore from '../../store/sessionStore';

const { Title } = Typography;

const CurrentVideoPage: React.FC = () => {
    const { userStatus, loading, error, refreshUserStatus } = useUserStatus();
    const session = SessionStore().session;
    const navigate = useNavigate();

    useEffect(() => {
        const handleUpload = (data: any) => {
            if (data.id === session?.id && data.filename.toLowerCase().includes('curr')) {
                setTimeout(() => navigate('/video/review3'), 1500);
                // refreshUserStatus();
            }
        };
        socket.on('videoUpload', handleUpload);
        return () => {
            socket.off('videoUpload', handleUpload);
        };
    }, [session?.id, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <>{error}</>;
    if (!userStatus?.stage2) return <Navigate to="/profile" replace />;
    if (!userStatus?.curr_speech_stage) return <Navigate to="/video/review2" replace />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-8">
            <div className="w-full max-w-3xl p-6 bg-gray-100 rounded-md shadow-sm">
                <Title level={4} className="text-center">📋 Rules for Current Life Recording</Title>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-base">
                    <li>Clearly state your name, which city/country you are based in</li>
                    <li>Give a brief introduction / overview of yourself - covering both professional and personal aspects</li>
                    <li>Name of your current organization and your work profile</li>
                    <li>Name the location or locations or you can say remote</li>
                    <li>How and when did you start this journey?</li>
                    <li>What work does the organization do - please describe what problems are solved via your products, solutions, services</li>
                    <li>What is the current state? What progress has been made in terms of products, customers, revenues, team size or anything else</li>
                    <li>Anything interesting you want to share about your organisation / startup, team etc.</li>
                </ul>
            </div>

            <div className="w-full max-w-3xl">
                <VideoRecorderUploader
                    name_of_video="Current Life"
                    uploadApi={`${backend_url}/user/currvideo`}
                    onUploadComplete={refreshUserStatus}
                // nextRoute="/video/review3"
                />
            </div>
        </div>
    );
};

export default CurrentVideoPage;