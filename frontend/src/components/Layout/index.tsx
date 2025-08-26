import React from 'react';
import { Layout } from 'antd';
import HeaderComp from '../headerMenu';
import Sidebar from '../page_sidebar';
import type { LayoutWrapperProps } from '../../schema/props';
const { Content } = Layout;

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ title, children }) => {
    return (
        <Layout className="bg-transparent max-h-[98vh]">
            <HeaderComp title_of_page={title} />
            <Layout className='bg-transparent'>
                <Sidebar />
                <Content className="p-4 overflow-scroll">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutWrapper;