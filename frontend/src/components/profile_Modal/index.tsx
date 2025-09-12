import React from 'react';
import { Modal, Descriptions, Avatar, Divider, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { profileViewerProps } from '../../schema/props';
import backend_url from '../../Libs/env';

const { Text } = Typography;

const arrayRenderer = (arr?: any) => arr?.length ? arr.map((item: any, i: any) => <Tag key={i} color="blue">{item}</Tag>) : <Text type="secondary">N/A</Text>;

const Modal_ProfileViewer: React.FC<profileViewerProps> = ({
    open,
    onClose,
    profileData,
    profileEmail
}) => {
    if (!profileData) return null;

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
        <Modal
            title={
                <div className="text-blue-700 text-xl font-bold">
                    Profile Preview
                </div>
            } open={open}
            onCancel={onClose}
            width={1000}
            footer={null}
            modalRender={(modal) => (
                <div className="w-[80vw] h-[80vh] overflow-auto border-red border-4 rounded-xl p-1">{modal}</div>
            )}
        >
            <div className="text-center mb-6">
                <Avatar
                    size={100}
                    src={profilePhoto ? `${backend_url}/upload/${profileEmail}/${profilePhoto}` : ''}
                    icon={<UserOutlined />}
                />
                <h2 className="mt-1 text-xl font-semibold">
                    {[firstName, middleName, lastName].filter(Boolean).join(' ')}
                </h2>
                <p className="text-gray-600">{organization} | {position}</p>
            </div>

            <div className="mb-6 p-4 bg-slate-100 rounded-md shadow-sm">
                <Divider orientation="left">
                    <span className="text-lg font-semibold text-blue-800">Basic Info</span>
                </Divider>
                <Descriptions
                    bordered
                    column={1}
                    size="small"
                    labelStyle={{ fontWeight: 'bold' }}
                >
                    <Descriptions.Item label="Mobile">{mobile}</Descriptions.Item>
                    <Descriptions.Item label="City">{city}</Descriptions.Item>
                    <Descriptions.Item label="Area">{area}</Descriptions.Item>
                    <Descriptions.Item label="Age">{age || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Experience">{experience || 'N/A'} years</Descriptions.Item>
                    <Descriptions.Item label="Skills">{arrayRenderer(skills)}</Descriptions.Item>
                    <Descriptions.Item label="Links">{contentLinks}</Descriptions.Item>
                    <Descriptions.Item label="Socials">
                        {(Object.entries(socials || {}) as [string, string][]).map(([platform, url]) =>
                            url ? (
                                <div key={platform} className="mb-1">
                                    <strong>{platform}:</strong>{' '}
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                                        {url}
                                    </a>
                                </div>
                            ) : null
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </div>

            <div className="mb-6 p-4 bg-orange-100 rounded-md shadow-sm">
                <Divider orientation="left">
                    <span className="text-lg font-semibold text-indigo-800">Introduction</span>
                </Divider>
                <p>{introduction || 'N/A'}</p>

                <Divider orientation="left">
                    <span className="text-lg font-semibold text-indigo-800">Quote</span>
                </Divider>
                <p>{quote || 'N/A'}</p>

                <Divider orientation="left">
                    <span className="text-lg font-semibold text-indigo-800">Joy</span>
                </Divider>
                <p>{joy || 'N/A'}</p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-md shadow-sm">
                <Divider orientation="left">
                    <span className="text-lg font-semibold text-blue-900">Early Life of {firstName}</span>
                </Divider>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">{early_life_data?.Name || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Birth City">{early_life_data?.Birth_city || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Hometown">{early_life_data?.Hometown_city || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Schools">{early_life_data?.Schools?.map((s: any) => `${s.name} (${s.location})`).join(', ') || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Colleges">{early_life_data?.Colleges?.map((c: any) => `${c.name} (${c.location})`).join(', ') || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Tags">{arrayRenderer(early_life_data?.Early_life_tags)}</Descriptions.Item>
                </Descriptions>
                {videoURL(Early_video) && (
                    <>
                        <Divider orientation="left">Early Life Video</Divider>
                        <video src={videoURL(Early_video)} controls style={{ display: 'block', margin: '0 auto', width: '50%' }} />
                    </>
                )}
            </div>

            <div className="mb-6 p-4 bg-green-50 rounded-md shadow-sm">
                <Divider orientation="left">
                    <span className="text-lg font-semibold text-green-900">Current Life of {firstName}</span>
                </Divider>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="Summary">{curr_life_data?.Current_life_summary || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Cities">{arrayRenderer(curr_life_data?.Current_cities)}</Descriptions.Item>
                    <Descriptions.Item label="Organizations">{arrayRenderer(curr_life_data?.Current_organizations)}</Descriptions.Item>
                    <Descriptions.Item label="Roles">{arrayRenderer(curr_life_data?.Current_roles)}</Descriptions.Item>
                    <Descriptions.Item label="Travel Cities">{arrayRenderer(curr_life_data?.Travel_cities)}</Descriptions.Item>
                    <Descriptions.Item label="Tags">{arrayRenderer(curr_life_data?.Current_life_tags)}</Descriptions.Item>
                </Descriptions>
                {videoURL(curr_video) && (
                    <>
                        <Divider orientation="left">Current Life Video</Divider>
                        <video src={videoURL(curr_video)} controls style={{ display: 'block', margin: '0 auto', width: '50%' }} />
                    </>
                )}
            </div>

            <div className="mb-6 p-4 bg-yellow-50 rounded-md shadow-sm">
                <Divider orientation="left">
                    <span className="text-lg font-semibold text-yellow-800">Professional Life of {firstName}</span>
                </Divider>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="First Job">{prof_life_data?.First_job || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Roles">{arrayRenderer(prof_life_data?.Other_roles)}</Descriptions.Item>
                    <Descriptions.Item label="Companies">{prof_life_data?.Other_companies?.map((c: any) => `${c.companyName} - ${c.role} (${c.place})`).join(', ') || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Tags">{arrayRenderer(prof_life_data?.Professional_tags)}</Descriptions.Item>
                </Descriptions>
                {videoURL(prof_video) && (
                    <>
                        <Divider orientation="left">Professional Life Video</Divider>
                        <video src={videoURL(prof_video)} controls style={{ display: 'block', margin: '0 auto', width: '50%' }} />
                    </>
                )}
            </div>
        </Modal>
    );
};

export default Modal_ProfileViewer;