import { create } from 'zustand';
import type { sessionState } from '../schema/authSchema';
import getSession from '../session/getSession';

const SessionStore = create<sessionState>((set) => ({
    session: null,
    async init() {
        const session = await getSession();
        set({
            session
        })
    }
}));

export default SessionStore;