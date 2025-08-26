import { Server } from 'socket.io';
let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        console.log('Socket Connected:', socket.id);
        socket.on('someEvent', (data) => {
            console.log('Received someEvent:', data);
        });

        socket.on('disconnect', () => {
            console.log('Socket Disconnected:', socket.id);
        });
    });
};

const getIo = () => io;
export { initializeSocket, getIo };