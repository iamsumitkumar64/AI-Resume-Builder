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
                refreshUserStatus();
                setTimeout(() => navigate('/video/review3'), 1500);
            }
        };
        socket.on('videoUpload', handleUpload);
        return () => {
            socket.off('videoUpload');
        };
    }, [session?.id, refreshUserStatus, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <>{error}</>;
    if (!userStatus?.stage2) return <Navigate to="/profile" replace />;
    if (!userStatus?.curr_speech_stage) return <Navigate to="/video/review2" replace />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-8">
            <div className="w-full max-w-3xl p-6 bg-gray-100 rounded-md shadow-sm">
                <Title level={4} className="text-center">📋 Rules for Current Life Recording</Title>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-base">
                    <li>State your name and where you're currently based</li>
                    <li>Give a brief intro — professionally and personally</li>
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