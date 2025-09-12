import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, message, Upload, Tag, Space, Row, Col, InputNumber, Image, Card
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import backend_url from '../../Libs/env';
import type { profile_form_Schema } from '../../schema/profile_Form_Schema';
import Paragraph from 'antd/es/typography/Paragraph';
import { useNavigate } from 'react-router';
import SessionStore from '../../store/sessionStore';

const ProfileForm: React.FC = () => {
    const [form] = Form.useForm<profile_form_Schema>();
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [profileImage, setProfileImage] = useState<string>('');
    const [lockPersonalInfo, setLockPersonalInfo] = useState(false);
    const session = SessionStore((state) => state.session);
    const navigate = useNavigate();

    const handleAddSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]: any) => {
                if (key === 'profilePhoto' || key === 'skills') return;
                if (value) formData.append(key, value);
            });
            if (values.profilePhoto?.[0]?.originFileObj) {
                formData.append('profilePhoto', values.profilePhoto[0].originFileObj);
            }
            formData.append('skills', JSON.stringify(skills));
            await axios.post(`${backend_url}/auth/profile`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            messageApi.success('Profile completed successfully!');
            navigate('/video');
        } catch (err: any) {
            messageApi.error(err.response?.data?.message || 'Profile update failed');
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        beforeUpload: (file: File) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
            }
            return isImage ? false : Upload.LIST_IGNORE;
        },
        maxCount: 1,
        listType: 'picture' as const,
        accept: "image/*"
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(`${backend_url}/user/profile`, {
                    withCredentials: true
                });
                if (data) {
                    form.setFieldsValue({
                        firstName: data.firstName,
                        middleName: data.middleName,
                        lastName: data.lastName,
                        organization: data.organization,
                        role: data.position,
                        phoneNumber: data.phoneNumber,
                        city: data.city,
                        area: data.area,
                        twitter: data.socials?.twitter,
                        instagram: data.socials?.instagram,
                        linkedin: data.socials?.linkedin,
                        otherSocials: data.socials?.otherSocials,
                        introduction: data.introduction,
                        quote: data.quote,
                        joy: data.joy,
                        contentLinks: data.contentLinks?.join('\n'),
                        age: data.age,
                        experience: data.experience,
                    });
                    if (data.profilePhoto) {
                        setProfileImage(`${backend_url}/upload/${session?.email}/${data.profilePhoto}`);
                    }
                    setSkills(data.skills || []);
                    if (data.firstName && data.middleName && data.lastName && data.phoneNumber) {
                        setLockPersonalInfo(true);
                    }
                }
            } catch (err) {
                console.error("Failed to load profile", err);
                messageApi.error('Failed to load profile data');
            }
        };
        if (session?.email) {
            fetchProfile();
        }
    }, [session?.email]);

    return (
        <>
            {contextHolder}
            <Row gutter={24} className="items-center justify-between w-full">
                <Col>
                    <Paragraph className="text-blue-700 m-0 text-2xl">
                        Complete Your Profile
                    </Paragraph>
                </Col>
                {profileImage &&
                    <Col>
                        <Image
                            width={100}
                            className="rounded-full"
                            src={profileImage}
                        />
                    </Col>
                }
            </Row>

            <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-white"
                onFinishFailed={() => {
                    messageApi.error('Please fill form properly.');
                }}>
                <Row gutter={24}>
                    <Col span={24}>
                        <Card className='bg-gray-100 m-5' title="Personal Information">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                                        <Input disabled={lockPersonalInfo} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Middle Name" name="middleName">
                                        <Input disabled={lockPersonalInfo} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                                        <Input disabled={lockPersonalInfo} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Phone Number (with WhatsApp)"
                                        name="phoneNumber"
                                        rules={[
                                            { required: true, message: 'Include country code e.g., +91-9999999999' },
                                            { pattern: /^\+?[0-9-]+$/, message: 'Phone number must contain only digits, +, and -' }
                                        ]}
                                    >
                                        <Input
                                            disabled={lockPersonalInfo}
                                            placeholder="+91-9999999999"
                                            inputMode="numeric"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Age" name="age" rules={[{ required: true }]}>
                                        <InputNumber min={18} max={100} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className='bg-gray-100 m-5' title="Professional Information">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Current Organization" name="organization" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Current Title/Role" name="role" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Years of Experience" name="experience" rules={[{ required: true }]}>
                                        <InputNumber min={0} max={50} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className='bg-gray-100 m-5' title="Location">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Current City" name="city" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Current Area with Pin code" name="area" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className='bg-gray-100 m-5' title="Social Links">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Twitter Handle" name="twitter">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Instagram Profile" name="instagram">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="LinkedIn Profile" name="linkedin">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Other Social Handles" name="otherSocials">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className='bg-gray-100 m-5' title="Profile Photo & Skills">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Profile Photo"
                                        name="profilePhoto"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                                        rules={profileImage ? [] : [{ required: true, message: 'Please upload a profile photo' }]}
                                    >
                                        <Upload {...uploadProps}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Skills">
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Input
                                                placeholder="Enter a skill and press Add"
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onPressEnter={handleAddSkill}
                                                suffix={<Button type="link" onClick={handleAddSkill}>Add</Button>}
                                            />
                                            <Space wrap>
                                                {skills.map((skill) => (
                                                    <Tag key={skill} closable onClose={() => handleRemoveSkill(skill)}>
                                                        {skill}
                                                    </Tag>
                                                ))}
                                            </Space>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className='bg-gray-100 m-5' title="About You">
                            <Form.Item label="Brief Introduction" name="introduction" rules={[{ required: true }]}>
                                <Input.TextArea rows={3} maxLength={600} />
                            </Form.Item>
                            <Form.Item label="A Quote That Inspires You" name="quote" rules={[{ required: true }]}>
                                <Input.TextArea rows={2} />
                            </Form.Item>
                            <Form.Item label="What fills you with joy, outside your work?" name="joy" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Links to Content (Blogs, Videos, etc.)" name="contentLinks">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600 hover:bg-blue-700">
                                Complete Profile
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default ProfileForm;