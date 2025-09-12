import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import useUserStatus from '../../hooks/useUserStatus';
import { socket } from '../../config/socket';
import VideoRecorderUploader from '../../components/videoComp';
import backend_url from '../../Libs/env';
import SessionStore from '../../store/sessionStore';

const EarlyVideoPage: React.FC = () => {
    const { userStatus, loading, error, refreshUserStatus } = useUserStatus();
    const navigate = useNavigate();
    const session = SessionStore().session;

    useEffect(() => {
        const handleUpload = (data: any) => {
            if (data.id === session?.id && data.filename.toLowerCase().includes('early')) {
                setTimeout(() => navigate('/video/review1'), 1500);
                // refreshUserStatus();
            }
        };
        socket.on("videoUpload", handleUpload);
        return () => { socket.off("videoUpload", handleUpload); }
    }, [session?.id, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!userStatus?.stage2) return <Navigate to="/profile" replace />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-8">
            <VideoRecorderUploader
                name_of_video="Early Life"
                uploadApi={`${backend_url}/user/earlyvideo`}
                onUploadComplete={refreshUserStatus}
            />
        </div>
    );
};

export default EarlyVideoPage;