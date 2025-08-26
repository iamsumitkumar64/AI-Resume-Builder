import React, { useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import type { ReactNode } from 'react';

const { Title } = Typography;

interface CustomModalProps {
    title: string;
    children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ title, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                type="primary"
                onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
            >
                {title}
            </Button>

            <Modal
                title={<Title level={4} className="!m-0">{title}</Title>}
                open={open}
                onCancel={() => setOpen(false)}
                footer={[
                    <Button
                        key="ok"
                        type="primary"
                        onClick={() => setOpen(false)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        OK
                    </Button>
                ]}
            >
                <div className="p-2">
                    {children}
                </div>
            </Modal>
        </>
    );
};

export default CustomModal;