import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { Navigate } from 'react-router-dom';
import VideoRecorderUploader from '../../components/videoComp/index.tsx';
import useUserStatus from '../../hooks/useUserStatus';
import backend_url from '../../Libs/env';
import { socket } from '../../config/socket.tsx';
import { useNavigate } from 'react-router-dom';
import SessionStore from '../../store/sessionStore';

const { Title } = Typography;

const ProfessionalVideoPage: React.FC = () => {
    const { userStatus, loading, error, refreshUserStatus } = useUserStatus();
    const session = SessionStore().session;
    const navigate = useNavigate();

    useEffect(() => {
        const handleUpload = (data: any) => {
            if (data.id === session?.id && data.filename.toLowerCase().includes('prof')) {
                setTimeout(() => navigate('/video/review2'), 1500);
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
    if (!userStatus?.prof_speech_stage) return <Navigate to="/video/review1" replace />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-8">
            <div className="w-full max-w-3xl p-6 bg-gray-100 rounded-md shadow-sm">
                <Title level={4} className="text-center">📋 Rules for Professional Life Recording</Title>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-base">
                    <li>Number of years in your professional journey</li>
                    <li>Cover various jobs / roles you've had: intern, employee, founder, freelancer</li>
                    <li>Mention companies: what you did, how long, where</li>
                    <li>Share specific learnings or experiences from each role</li>
                    <li>Cover everything except your current role</li>
                </ul>
            </div>
            <div className="w-full max-w-3xl">
                <VideoRecorderUploader
                    name_of_video="Professional Life"
                    uploadApi={`${backend_url}/user/profvideo`}
                    onUploadComplete={refreshUserStatus}
                // nextRoute="/video/review2"
                />
            </div>
        </div>
    );
};

export default ProfessionalVideoPage;