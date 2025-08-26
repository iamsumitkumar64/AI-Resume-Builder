import { Navigate } from 'react-router-dom';
import { Result, Button, Space, message, Spin } from 'antd';
import LayoutWrapper from '../components/Layout';
import useUserStatus from '../hooks/useUserStatus';
import { SmileOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import SessionStore from '../store/sessionStore';
import backend_url from '../Libs/env';
import UserPage from './Profile_Page';
import { socket } from '../config/socket';

const ConfirmPage: React.FC = () => {
    socket.on('connect', () => {
        console.log('Connected to the socket server!');
    });
    const { userStatus, loading, error, refreshUserStatus } = useUserStatus();
    const [sending, setSending] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const session = SessionStore().session;

    useEffect(() => {
        if (userStatus?.approvedByAdmin == 1) {
            setIsApproved(true);
        }
    }, [userStatus]);

    useEffect(() => {
        const handleAccept = (data: any) => {
            if (data.userId === session?.id) {
                setIsApproved(true);
                setIsRejected(false);
                message.success("🎉 Your profile has been approved by admin!");
            }
        };

        const handleReject = async (data: any) => {
            if (data.userId === session?.id) {
                setIsApproved(false);
                setIsRejected(true);
                message.error("❌ Your profile has been rejected by admin.");
                await refreshUserStatus();
            }
        };

        socket.on("approvalAccept", handleAccept);
        socket.on("approvalReject", handleReject);

        return () => {
            socket.off("approvalAccept", handleAccept);
            socket.off("approvalReject", handleReject);
        };
    }, [session?.id, refreshUserStatus]);


    const handleSendForApproval = async () => {
        if (!session?.id) return;
        try {
            setSending(true);
            const res = await fetch(`${backend_url}/admin/approval`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ userId: session.id }),
            });
            const data = await res.json();
            if (data.success) {
                message.success('Profile sent for admin approval');
                await refreshUserStatus();
                setIsRejected(false);
                setIsApproved(false);
            }
            else {
                message.error(data.message || 'Failed to send approval');
            }
        } catch (err) {
            console.error(err);
            message.error('Something went wrong');
        } finally {
            setSending(false);
        }
    };

    const handlerestart = async () => {
        if (!session?.id) return;
        try {
            setSending(true);
            const res = await fetch(`${backend_url}/user/restart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ userId: session.id }),
            });
            const data = await res.json();
            if (data.message) {
                message.success(data.message || 'Profile Resatrt');
                await refreshUserStatus();
            } else {
                message.error(data.message || 'Failed to Restart Request');
            }
        } catch (err) {
            console.error(err);
            message.error('Something went wrong');
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <Result
                status="info"
                title={<Spin tip="Loading..." />}
                subTitle="Checking your current status..."
            />
        );
    }

    if (error) {
        return <Result status="error" title="Error" subTitle={error} />;
    }

    if (!userStatus?.stage3) {
        return <Navigate to="/video" replace />;
    }

    if (isRejected || userStatus.rejectionCount > 2) {
        return (
            <LayoutWrapper title="Profile Rejected">
                <Result
                    status="error"
                    title="Profile Rejected ❌"
                    subTitle="Your profile has been rejected by admin.You can be blacklist if you face rejection more than 2 times"
                    extra={
                        <Space direction="vertical">
                            {userStatus.rejectionCount < 3 &&
                                <> <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleSendForApproval}
                                    loading={sending}
                                >
                                    📤 Resend to Admin for Approval
                                </Button>
                                    <Button
                                        danger
                                        size="large"
                                        onClick={handlerestart}
                                    >
                                        🔄 Restart the Entire Process
                                    </Button>
                                </>}
                        </Space>
                    }
                />
            </LayoutWrapper>
        );
    }

    if (!isApproved && !isRejected && userStatus?.sentforapproval) {
        return (
            <LayoutWrapper title="Pending Approval">
                <Result
                    status="info"
                    title="⏳ Awaiting Admin Approval"
                    subTitle="Your profile has been sent for admin approval. We'll notify you once a decision is made."
                />
            </LayoutWrapper>
        );
    }

    if (isApproved) {
        return (
            <LayoutWrapper title="You're Approved!">
                <UserPage />
            </LayoutWrapper>
        );
    }

    return (
        <LayoutWrapper title="All Stages Completed">
            <Result
                icon={<SmileOutlined />}
                status="success"
                title="Congratulations! 🎉"
                subTitle="You've successfully completed all stages."
                extra={
                    <Space direction="vertical">
                        <Button
                            size="large"
                            onClick={handleSendForApproval}
                            loading={sending}
                            disabled={userStatus?.sentforapproval}
                        >
                            {userStatus?.sentforapproval
                                ? '✅ Already Sent to Admin'
                                : '📤 Send to Admin for Approval'}
                        </Button>
                        <Button
                            danger
                            size="large"
                            disabled={userStatus?.sentforapproval}
                            onClick={handlerestart}>
                            Restart the Entire Process
                        </Button>
                    </Space>
                }
            />
        </LayoutWrapper>
    );
};

export default ConfirmPage;