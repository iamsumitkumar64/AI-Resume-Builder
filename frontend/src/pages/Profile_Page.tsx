import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import backend_url from '../Libs/env';
import ProfileViewerPage from '../components/profileViwerPage';

const UserPage: React.FC = () => {
    const [profileEmail, setProfileEmail] = useState<string>('');
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const idRes = await fetch(backend_url, { credentials: 'include' });
                if (!idRes.ok) throw new Error("Failed to fetch user info");
                const idData = await idRes.json();
                const userId = idData.id;
                setProfileEmail(idData.email || '');

                const profileRes = await fetch(`${backend_url}/admin/user/profile/${userId}`, {
                    credentials: 'include',
                });
                if (!profileRes.ok) throw new Error("Failed to fetch profile");
                const profile = await profileRes.json();
                setProfileData(profile.data);

                message.success("Profile loaded successfully");
            } catch (err) {
                console.error(err);
                message.error("Failed to load profile");
            }
        };

        fetchProfile();
    }, []);

    return (
        <ProfileViewerPage profileData={profileData} profileEmail={profileEmail} />
    );
};

export default UserPage;