import { Card } from 'antd';
import PageLayout from '../components/Admin_Forget';
import GetAllAdmins from '../components/getAdmins';

const AdminsContactPage = () => {
    return (
        <PageLayout pageTitle="Admin Members">
            <Card
                title={<span className="text-lg font-semibold text-blue-900">Meet Our Admin Team</span>}
                bordered={false}
                className="w-full max-w-4xl shadow-md rounded-xl bg-gray-300"
            >
                <GetAllAdmins />
            </Card>
        </PageLayout>
    );
};

export default AdminsContactPage;
