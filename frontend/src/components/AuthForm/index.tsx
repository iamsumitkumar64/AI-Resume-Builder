import React from 'react';
import {
    Form,
    Input,
    Button,
    Typography,
    Row,
    Col,
    message,
    Card
} from 'antd';
import {
    LockOutlined,
    MailOutlined,
    BookOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { AuthFormProps } from '../../schema/props';
import SessionStore from '../../store/sessionStore';

const { Paragraph } = Typography;

const AuthForm: React.FC<AuthFormProps> = ({
    title,
    buttonText = 'Submit',
    showContactAdmin = false,
    contactAdminAction,
    onSuccess,
    form,
    api,
    redirectTo,
}) => {
    const session = SessionStore().session;
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;

    const handleRequest = async (values: any) => {
        try {
            const res = await axios.post(api, values, {
                withCredentials: true,
            });
            messageApi.success(res.data.message || 'Request successful');
            usedForm.resetFields();

            if (onSuccess) {
                onSuccess(values);
            }

            if (redirectTo) {
                setTimeout(() => navigate(redirectTo), 1000);
            }
        } catch (err: any) {
            messageApi.error(err.response?.data?.message || 'Request failed');
        }
    };
    return (
        <>
            {contextHolder}
            <Row
                justify="center"
                align="middle"
                style={{ padding: '2rem' }}
            >
                <Col xs={24} sm={22} md={18} lg={12} xl={10}>
                    {title && (
                        <Paragraph className="text-3xl text-center mb-6 text-blue-600 font-bold"
                            style={{ fontFamily: 'outfit' }}>
                            <BookOutlined />{title}<BookOutlined />
                        </Paragraph>
                    )}
                    <Card style={{
                        backgroundColor: '#fff',
                        padding: '1rem',
                        borderRadius: '1vmax',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    }}>
                        <Form
                            form={usedForm}
                            onFinish={handleRequest}
                            layout="vertical"
                            requiredMark={false}
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email!' },
                                    { type: 'email', message: 'Invalid email format!' },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined style={{ color: '#000' }} />}
                                    placeholder="Email"
                                    style={{ backgroundColor: '#fff', color: '#000' }}
                                />
                            </Form.Item>

                            {
                                !session ?
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[
                                            { required: true, message: 'Please enter your password!' },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined style={{ color: '#000' }} />}
                                            placeholder="Password"
                                            style={{ backgroundColor: '#fff', color: '#000' }}
                                        />
                                    </Form.Item>
                                    :
                                    <Form.Item
                                        label="Mobile"
                                        name="mobile"
                                        rules={[
                                            { required: true, message: 'Please mobile!' },
                                        ]}
                                    >
                                        <Input
                                            prefix={<LockOutlined style={{ color: '#000' }} />}
                                            placeholder="mobile"
                                            style={{ backgroundColor: '#fff', color: '#000' }}
                                        />
                                    </Form.Item>
                            }
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    className="mx-auto bg-blue-600 hover:bg-blue-700 p-5 font-bold"
                                    style={{
                                        background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                                        color: '#fff',
                                    }}
                                >
                                    {buttonText}
                                </Button>
                            </Form.Item>

                            {showContactAdmin && contactAdminAction && (
                                <Form.Item>
                                    <Row>
                                        <Col span={24} className="flex justify-between">
                                            <Button
                                                type="default"
                                                className="border border-blue-600"
                                                onClick={contactAdminAction}
                                            >
                                                Contact Admin ?
                                            </Button>
                                            <Button
                                                type="default"
                                                className="border border-fuchsia-600"
                                                onClick={() => navigate('/forget')}
                                            >
                                                Forget Password ?
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            )}
                        </Form>
                    </Card>
                </Col>
            </Row >
        </>
    );
};

export default AuthForm;