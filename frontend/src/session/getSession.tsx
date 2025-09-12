import axios from 'axios';
import backend_url from '../Libs/env.tsx';
import type { AuthSessionData } from '../schema/authSchema.tsx';

const getSession = async (): Promise<AuthSessionData | null> => {
    try {
        const res = await axios.get(backend_url, { headers: {}, withCredentials: true });
        return res?.data;
    }
    catch (e) {
        return null;
    }
};

export default getSession;