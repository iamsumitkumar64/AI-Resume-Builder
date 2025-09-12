import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Space, Tag, Row, Col, message, Card
} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backend_url from '../../Libs/env';
import useUserStatus from '../../hooks/useUserStatus';

interface ProfessionalLifeFormProps {
    onFormSubmit?: () => void;
    nextRoute?: string;
}

const ProfessionalLifeForm: React.FC<ProfessionalLifeFormProps> = ({ onFormSubmit, nextRoute }) => {
    const [form] = Form.useForm();
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { refreshUserStatus } = useUserStatus();
    const navigate = useNavigate();

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
            setTags([...tags, trimmed]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    useEffect(() => {
        const fetchProfessionalLifeData = async () => {
            try {
                const res = await axios.get(`${backend_url}/user/extracted-data`, {
                    withCredentials: true
                });

                const data = res.data?.data?.professionalLife?.extractedData;
                if (data) {
                    form.setFieldsValue({
                        firstJobCompany: data.First_job || '',
                        firstJobRole: (data.Other_roles || []).join(', '),
                        otherCompanies: (data.Other_companies || []).map((c: any) => ({
                            companyName: c.companyName || '',
                            role: c.role || '',
                            place: c.place || ''
                        }))
                    });
                    setTags(data.Professional_tags || []);
                }
            } catch (err) {
                messageApi.warning('Could not fetch professional life data.');
            }
        };

        fetchProfessionalLifeData();
    }, [form, messageApi]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                prof_life_data: {
                    First_job: values.firstJobCompany,
                    Other_companies: values.otherCompanies || [],
                    Other_roles: values.firstJobRole.split(',').map((r: string) => r.trim()),
                    Professional_tags: tags
                },
            };

            await axios.post(`${backend_url}/user/professional-life-data`, payload, {
                withCredentials: true
            });

            messageApi.success('Professional life data submitted!');
            setTimeout(() => {
                if (onFormSubmit) onFormSubmit();
                // else refreshUserStatus();
                if (nextRoute) navigate(nextRoute);
            }, 1000);
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Row className="items-center justify-between w-full mb-6">
                <Col>
                    <h2 className="text-blue-700 m-0 text-2xl">Review - Professional Life</h2>
                </Col>
            </Row>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="text-white"
                onFinishFailed={() => {
                    messageApi.error('Please fill form properly.');
                }}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="First Job">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="First Job Company"
                                        name="firstJobCompany"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="e.g., Infosys, Tata Steel" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Roles Played"
                                        name="firstJobRole"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="e.g., Developer, QA Tester" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="Other Companies">
                            <Form.List name="otherCompanies">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{ display: 'flex', marginBottom: 8 }}
                                                align="baseline"
                                                wrap
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'companyName']}
                                                    rules={[{ required: true, message: 'Company required' }]}
                                                >
                                                    <Input placeholder="Company" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'role']}
                                                    rules={[{ required: true, message: 'Role required' }]}
                                                >
                                                    <Input placeholder="Role" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'place']}
                                                    rules={[{ required: true, message: 'Place required' }]}
                                                >
                                                    <Input placeholder="Place" />
                                                </Form.Item>
                                                <Button danger onClick={() => remove(name)}>Remove</Button>
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" className="bg-white" onClick={() => add()} block>
                                                + Add Company
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="Professional Tags">
                            <Form.Item label="Tags (up to 10)">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input
                                        placeholder="e.g., fintech, management"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onPressEnter={handleAddTag}
                                        suffix={<Button type="link" onClick={handleAddTag}>Add</Button>}
                                    />
                                    <Space wrap>
                                        {tags.map(tag => (
                                            <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
                                                {tag}
                                            </Tag>
                                        ))}
                                    </Space>
                                </Space>
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Submit Professional Life Data
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </>
    );
};

export default ProfessionalLifeForm;