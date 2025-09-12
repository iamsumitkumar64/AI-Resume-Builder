import React from 'react';
import { Card, Avatar, Tag, Divider, Typography, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { profileViewerProps } from '../../schema/props';
import backend_url from '../../Libs/env';

const { Title, Paragraph, Text } = Typography;

const arrayRenderer = (arr?: string[]) => arr?.length ? arr.map((item, i) => <Tag key={i} color="blue">{item}</Tag>) : <Text type="secondary">N/A</Text>;

const ProfileViewerPage: React.FC<profileViewerProps> = ({ profileData, profileEmail }) => {
    if (!profileData) return <p className="text-center text-gray-500 py-6">Loading profile...</p>;

    const {
        firstName,
        middleName,
        lastName,
        organization,
        position,
        mobile,
        city,
        area,
        introduction,
        quote,
        joy,
        contentLinks,
        skills,
        age,
        experience,
        socials,
        profilePhoto,
        Early_video,
        early_life_data,
        curr_video,
        curr_life_data,
        prof_video,
        prof_life_data
    } = profileData;

    const videoURL = (filename?: string) => filename ? `${backend_url}/upload/${profileEmail}/${filename}` : '';

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="shadow-lg rounded-lg mb-8">
                <div className="flex flex-col items-center">
                    <Avatar
                        size={120}
                        src={profilePhoto ? `${backend_url}/upload/${profileEmail}/${profilePhoto}` : ''}
                        icon={<UserOutlined />}
                    />
                    <Title level={3} className="mt-4 mb-1">
                        {[firstName, middleName, lastName].filter(Boolean).join(' ')}
                    </Title>
                    <Text type="secondary">{organization} • {position}</Text>
                </div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Basic Information" className="shadow-md rounded-lg">
                        <p><strong>📞 Mobile:</strong> {mobile || 'N/A'}</p>
                        <p><strong>🏙️ City:</strong> {city || 'N/A'}</p>
                        <p><strong>📍 Area:</strong> {area || 'N/A'}</p>
                        <p><strong>🎂 Age:</strong> {age || 'N/A'}</p>
                        <p><strong>💼 Experience:</strong> {experience ? `${experience} years` : 'N/A'}</p>
                        <p><strong>⚡ Skills:</strong> {arrayRenderer(skills)}</p>
                        <p><strong>🔗 Links:</strong> {arrayRenderer(contentLinks)}</p>
                        <Divider />
                        <div>
                            <strong>🌐 Socials:</strong>
                            <div className="mt-2">
                                {(Object.entries(socials || {}) as [string, string][]).map(([platform, url]) =>
                                    url ? (
                                        <p key={platform}>
                                            <Text strong>{platform}: </Text>
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                                                {url}
                                            </a>
                                        </p>
                                    ) : null
                                )}
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="About Me" className="shadow-md rounded-lg">
                        <Paragraph><strong>👋 Introduction:</strong> {introduction || 'N/A'}</Paragraph>
                        <Paragraph><strong>💡 Quote:</strong> <em>{quote || 'N/A'}</em></Paragraph>
                        <Paragraph><strong>🎉 Joy:</strong> {joy || 'N/A'}</Paragraph>
                    </Card>
                </Col>
            </Row>

            <Card title={`🌱 Early Life of ${firstName}`} className="shadow-md rounded-lg mt-6">
                <p><strong>🧾 Name:</strong> {early_life_data?.Name || 'N/A'}</p>
                <p><strong>🏙️ Birth City:</strong> {early_life_data?.Birth_city || 'N/A'}</p>
                <p><strong>🏠 Hometown:</strong> {early_life_data?.Hometown_city || 'N/A'}</p>
                <p><strong>🎓 Schools:</strong> {early_life_data?.Schools?.map((s: any) => `${s.name} (${s.location})`).join(', ') || 'N/A'}</p>
                <p><strong>🏫 Colleges:</strong> {early_life_data?.Colleges?.map((c: any) => `${c.name} (${c.location})`).join(', ') || 'N/A'}</p>
                <p><strong>🏷️ Tags:</strong> {arrayRenderer(early_life_data?.Early_life_tags)}</p>
                {videoURL(Early_video) && (
                    <div className="mt-4">
                        <Divider>🎥 Early Life Video</Divider>
                        <video src={videoURL(Early_video)} controls className="w-full md:w-2/3 mx-auto rounded-lg shadow" />
                    </div>
                )}
            </Card>

            <Card title={`🌍 Current Life of ${firstName}`} className="shadow-md rounded-lg mt-6">
                <p><strong>📖 Summary:</strong> {curr_life_data?.Current_life_summary || 'N/A'}</p>
                <p><strong>🏙️ Cities:</strong> {arrayRenderer(curr_life_data?.Current_cities)}</p>
                <p><strong>🏢 Organizations:</strong> {arrayRenderer(curr_life_data?.Current_organizations)}</p>
                <p><strong>👔 Roles:</strong> {arrayRenderer(curr_life_data?.Current_roles)}</p>
                <p><strong>✈️ Travel Cities:</strong> {arrayRenderer(curr_life_data?.Travel_cities)}</p>
                <p><strong>🏷️ Tags:</strong> {arrayRenderer(curr_life_data?.Current_life_tags)}</p>
                {videoURL(curr_video) && (
                    <div className="mt-4">
                        <Divider>🎥 Current Life Video</Divider>
                        <video src={videoURL(curr_video)} controls className="w-full md:w-2/3 mx-auto rounded-lg shadow" />
                    </div>
                )}
            </Card>

            <Card title={`💼 Professional Life of ${firstName}`} className="shadow-md rounded-lg mt-6">
                <p><strong>👔 First Job:</strong> {prof_life_data?.First_job || 'N/A'}</p>
                <p><strong>📌 Roles:</strong> {arrayRenderer(prof_life_data?.Other_roles)}</p>
                <p><strong>🏢 Companies:</strong> {prof_life_data?.Other_companies?.map((c: any) => `${c.companyName} - ${c.role} (${c.place})`).join(', ') || 'N/A'}</p>
                <p><strong>🏷️ Tags:</strong> {arrayRenderer(prof_life_data?.Professional_tags)}</p>
                {videoURL(prof_video) && (
                    <div className="mt-4">
                        <Divider>🎥 Professional Life Video</Divider>
                        <video src={videoURL(prof_video)} controls className="w-full md:w-2/3 mx-auto rounded-lg shadow" />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProfileViewerPage;