import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Card, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import backend_url from '../../Libs/env';
import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;

const ForgetPasswordPage: React.FC = () => {
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const sendOtp = async (values: any) => {
        setLoading(true);
        try {
            const res = await axios.post(`${backend_url}/auth/send-otp`, { email: values.email }, { withCredentials: true });
            if (res.data.success || res.status === 200) {
                message.success('OTP sent to your email');
                setEmail(values.email);
                setStep('otp');
            } else {
                message.error(res.data.message || 'Failed to send OTP');
            }
        } catch (err) {
            message.error('Something went wrong while sending OTP');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (values: any) => {
        setLoading(true);
        try {
            const res = await axios.post(`${backend_url}/auth/verify-otp`, { email, otp: values.otp }, { withCredentials: true });
            if (res.data.success) {
                message.success('OTP verified. Set your new password.');
                setOtp(values.otp);
                setStep('reset');
            } else {
                message.error(res.data.message || 'OTP verification failed');
            }
        } catch (err) {
            message.error('Something went wrong while verifying OTP');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (values: any) => {
        setLoading(true);
        try {
            const res = await axios.post(`${backend_url}/auth/reset-password`, { email, otp, password: values.password }, { withCredentials: true });
            if (res.data.success) {
                message.success('Password reset successfully!');
                navigate('/login');
            } else {
                message.error(res.data.message || 'Failed to reset password');
            }
        } catch (err) {
            message.error('Something went wrong while resetting password');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" align="middle" style={{ padding: '2rem' }}>
            <Col xs={24} sm={22} md={18} lg={12} xl={10}>
                <Card style={{ padding: '1rem', borderRadius: '1vmax', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                    {step === 'email' && (
                        <Form form={form} layout="vertical" onFinish={sendOtp}>
                            <Paragraph className="text-2xl text-center mb-6 text-blue-500">Forget Password</Paragraph>
                            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Invalid email' }]}>
                                <Input prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item>
                                <Button className='bg-blue-600 text-white' type="primary" htmlType="submit" block loading={loading}>Send OTP</Button>
                            </Form.Item>
                        </Form>
                    )}

                    {step === 'otp' && (
                        <Form form={form} layout="vertical" onFinish={verifyOtp}>
                            <Paragraph className="text-2xl text-center mb-6 text-blue-500">Verify OTP</Paragraph>
                            <Form.Item label="OTP" name="otp" rules={[{ required: true, message: 'Please enter the OTP' }]}>
                                <Input placeholder="Enter OTP" />
                            </Form.Item>
                            <Form.Item>
                                <Button className='bg-blue-600 text-white' type="primary" htmlType="submit" block loading={loading}>Verify OTP</Button>
                            </Form.Item>
                        </Form>
                    )}

                    {step === 'reset' && (
                        <Form form={form} layout="vertical" onFinish={resetPassword}>
                            <Paragraph className="text-2xl text-center mb-6 text-blue-500">Set New Password</Paragraph>
                            <Form.Item label="New Password" name="password" rules={[{ required: true, message: 'Please enter new password' }, { min: 6, message: 'Password must be at least 6 characters' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                            </Form.Item>
                            <Form.Item label="Confirm Password" name="confirmPassword" dependencies={['password']} rules={[
                                { required: true, message: 'Please confirm password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}>
                                <Input.Password placeholder="Confirm Password" />
                            </Form.Item>
                            <Form.Item>
                                <Button className='bg-blue-600 text-white' type="primary" htmlType="submit" block loading={loading}>Reset Password</Button>
                            </Form.Item>
                        </Form>
                    )}
                </Card>
            </Col>
        </Row>
    );
};

export default ForgetPasswordPage;