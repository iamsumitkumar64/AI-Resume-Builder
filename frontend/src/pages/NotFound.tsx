import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you are looking for does not exist."
            extra={
                <Button type="primary" onClick={() => navigate('/')} className='bg-blue-700'>
                    Go Back Home
                </Button>
            }
        />
    );
};

export default NotFoundPage;