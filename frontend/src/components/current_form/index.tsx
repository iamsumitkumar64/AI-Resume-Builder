import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Space, Tag, Row, Col, message, Card
} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backend_url from '../../Libs/env';
import useUserStatus from '../../hooks/useUserStatus';

interface CurrentLifeFormProps {
    onFormSubmit?: () => void;
    nextRoute?: string;
}

const CurrentLifeForm: React.FC<CurrentLifeFormProps> = ({ onFormSubmit, nextRoute }) => {
    const [form] = Form.useForm();
    const [summary, setSummary] = useState('');
    const [lifestyleTags, setLifestyleTags] = useState<string[]>([]);
    const [workTags, setWorkTags] = useState<string[]>([]);
    const [lifestyleInput, setLifestyleInput] = useState('');
    const [workInput, setWorkInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { refreshUserStatus } = useUserStatus();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const handleAddTag = (
        input: string,
        setInput: (val: string) => void,
        tags: string[],
        setTags: (val: string[]) => void
    ) => {
        const trimmed = input.trim();
        if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
            setTags([...tags, trimmed]);
            setInput('');
        }
    };

    const handleRemoveTag = (
        tag: string,
        tags: string[],
        setTags: (val: string[]) => void
    ) => {
        setTags(tags.filter(t => t !== tag));
    };

    useEffect(() => {
        const fetchCurrentLifeData = async () => {
            try {
                const res = await axios.get(`${backend_url}/user/extracted-data`, {
                    withCredentials: true
                });
                const data = res.data?.data?.currentLife?.extractedData;
                if (data) {
                    form.setFieldsValue({
                        currentCities: (data.Current_cities || []).join(', '),
                        currentOrgs: (data.Current_organizations || []).join(', '),
                        currentRoles: (data.Current_roles || []).join(', '),
                        frequentCities: (data.Travel_cities || []).join(', ')
                    });
                    setSummary(data.Current_life_summary || '');
                    const tags = data.Current_life_tags || [];
                    setLifestyleTags(tags.slice(0, 5));
                    setWorkTags(tags.slice(5, 10));
                }
            } catch (err) {
                messageApi.warning('Could not fetch current life data.');
            }
        };

        fetchCurrentLifeData();
    }, [form, messageApi]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                curr_life_data: {
                    Current_life_summary: summary,
                    Current_cities: values.currentCities.split(',').map((c: string) => c.trim()),
                    Current_organizations: values.currentOrgs.split(',').map((o: string) => o.trim()),
                    Current_roles: values.currentRoles.split(',').map((r: string) => r.trim()),
                    Travel_cities: values.frequentCities ? values.frequentCities.split(',').map((c: string) => c.trim()) : [],
                    Current_life_tags: [...lifestyleTags, ...workTags]
                }
            };

            await axios.post(`${backend_url}/user/current-life-data`, payload, {
                withCredentials: true
            });

            messageApi.success('Current life data submitted!');
            setTimeout(() => {
                if (onFormSubmit) onFormSubmit();
                else refreshUserStatus();
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
                    <h2 className="text-blue-700 m-0 text-2xl">Review - Current Life</h2>
                </Col>
            </Row>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="text-white"
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="Current Life Summary">
                            <Form.Item
                                label="Current Life Summary (under 75 words)"
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea
                                    rows={3}
                                    maxLength={500}
                                    showCount
                                    placeholder="Summarize this person's current life in less than 75 words"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="Current Location & Work">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Cities Currently Living In"
                                        name="currentCities"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="e.g., Delhi, Bangalore" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Current Organisation(s)"
                                        name="currentOrgs"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="e.g., Google, Own Startup" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Current Role(s)"
                                        name="currentRoles"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="e.g., Software Engineer, Product Manager" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Cities Frequently Travelled To"
                                        name="frequentCities"
                                    >
                                        <Input placeholder="e.g., Mumbai, Pune, Dubai" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="Tags">
                            <Form.Item label="Lifestyle Tags (cities, hobbies, sports, interests)">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input
                                        placeholder="e.g., football, photography, Mumbai, trekking"
                                        value={lifestyleInput}
                                        onChange={(e) => setLifestyleInput(e.target.value)}
                                        onPressEnter={() =>
                                            handleAddTag(lifestyleInput, setLifestyleInput, lifestyleTags, setLifestyleTags)
                                        }
                                        suffix={
                                            <Button
                                                type="link"
                                                onClick={() =>
                                                    handleAddTag(lifestyleInput, setLifestyleInput, lifestyleTags, setLifestyleTags)
                                                }
                                            >
                                                Add
                                            </Button>
                                        }
                                    />
                                    <Space wrap>
                                        {lifestyleTags.map(tag => (
                                            <Tag key={tag} closable onClose={() => handleRemoveTag(tag, lifestyleTags, setLifestyleTags)}>
                                                {tag}
                                            </Tag>
                                        ))}
                                    </Space>
                                </Space>
                            </Form.Item>

                            <Form.Item label="Professional Tags (sector, skills, learnings, specialisations)">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input
                                        placeholder="e.g., fintech, AI/ML, leadership, backend dev"
                                        value={workInput}
                                        onChange={(e) => setWorkInput(e.target.value)}
                                        onPressEnter={() =>
                                            handleAddTag(workInput, setWorkInput, workTags, setWorkTags)
                                        }
                                        suffix={
                                            <Button
                                                type="link"
                                                onClick={() =>
                                                    handleAddTag(workInput, setWorkInput, workTags, setWorkTags)
                                                }
                                            >
                                                Add
                                            </Button>
                                        }
                                    />
                                    <Space wrap>
                                        {workTags.map(tag => (
                                            <Tag key={tag} closable onClose={() => handleRemoveTag(tag, workTags, setWorkTags)}>
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
                                Submit Current Life Data
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default CurrentLifeForm;
