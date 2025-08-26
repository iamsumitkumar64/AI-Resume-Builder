import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Space, Tag, Row, Col, message, Card
} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backend_url from '../../Libs/env';
import useUserStatus from '../../hooks/useUserStatus';

interface EarlyLifeFormProps {
    onFormSubmit?: () => void;
    nextRoute?: string;
}

const EarlyLifeForm: React.FC<EarlyLifeFormProps> = ({ onFormSubmit, nextRoute }) => {
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
        const fetchEarlyLifeData = async () => {
            try {
                const res = await axios.get(`${backend_url}/user/extracted-data`, {
                    withCredentials: true
                });
                const data = res.data?.data?.earlyLife?.extractedData;
                if (data) {
                    form.setFieldsValue({
                        name: data.Name || '',
                        birthCity: data.Birth_city || '',
                        hometownCity: data.Hometown_city || '',
                        schools: data.Schools || [],
                        colleges: data.Colleges || []
                    });
                    setTags(data.Early_life_tags || []);
                }
            } catch (err) {
                messageApi.warning('Could not fetch early life data.');
            }
        };
        fetchEarlyLifeData();
    }, [form, messageApi]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                name: values.name,
                birthCity: values.birthCity,
                hometownCity: values.hometownCity,
                schools: Array.isArray(values.schools)
                    ? values.schools.filter((item: any) => item?.name && item?.location)
                    : [],
                colleges: Array.isArray(values.colleges)
                    ? values.colleges.filter((item: any) => item?.name && item?.location)
                    : [],
                tags: tags
            };

            await axios.post(`${backend_url}/user/early-life-data`, payload, {
                withCredentials: true
            });

            messageApi.success('Early life data submitted!');
            setTimeout(() => {
                if (onFormSubmit) onFormSubmit();
                else refreshUserStatus();
                if (nextRoute) navigate(nextRoute);
            }, 1000);
        } catch (error: any) {
            console.error(error);
            messageApi.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Row className="items-center justify-between mb-6">
                <Col>
                    <h2 className="text-blue-700 m-0 text-2xl">Review - Early Life</h2>
                </Col>
            </Row>
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="text-white">
                <Row gutter={24}>
                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="Basic Information">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[{ required: true, message: 'Please enter the name.' }]}
                                    >
                                        <Input placeholder="Full name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Birth City"
                                        name="birthCity"
                                        rules={[{ required: true, message: 'Please enter the birth city.' }]}
                                    >
                                        <Input placeholder="City of birth" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Hometown City"
                                        name="hometownCity"
                                        rules={[{ required: true, message: 'Please enter the hometown city.' }]}
                                    >
                                        <Input placeholder="Hometown" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="Education">
                            <Form.List name="schools">
                                {(fields, { add, remove }) => (
                                    <>
                                        <label className="text-black">School(s)</label>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" wrap>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    rules={[{ required: true, message: 'Enter school name' }]}
                                                >
                                                    <Input placeholder="School Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'location']}
                                                    rules={[{ required: true, message: 'Enter location' }]}
                                                >
                                                    <Input placeholder="City / Location" />
                                                </Form.Item>
                                                <Button danger onClick={() => remove(name)}>Remove</Button>
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" className='bg-white' onClick={() => add()} block>
                                                + Add School
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <Form.List name="colleges">
                                {(fields, { add, remove }) => (
                                    <>
                                        <label className="text-black mt-4">College(s)</label>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" wrap>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    rules={[{ required: true, message: 'Enter college name' }]}
                                                >
                                                    <Input placeholder="College Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'location']}
                                                    rules={[{ required: true, message: 'Enter location' }]}
                                                >
                                                    <Input placeholder="City / Location" />
                                                </Form.Item>
                                                <Button danger onClick={() => remove(name)}>Remove</Button>
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" className='bg-white' onClick={() => add()} block>
                                                + Add College
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card className="bg-gray-100 m-5" title="Tags / Interests">
                            <Form.Item label="Tags (up to 10)">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input
                                        placeholder="Enter a tag (e.g., cricket, reading)"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onPressEnter={handleAddTag}
                                        suffix={<Button type="link" onClick={handleAddTag}>Add</Button>}
                                    />
                                    <Space wrap>
                                        {tags.map((tag) => (
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
                                Submit Early Life Data
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default EarlyLifeForm;