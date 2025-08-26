import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { connectDB } from './DbConnect.js';
import mainRouter from './src/routes/index.js';
import MongoStore from 'connect-mongo';
import { initializeSocket } from './src/config/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();
const PORT = process.env.PORT;
const frontend_url = process.env.FRONTEND_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

initializeSocket(server);

app.use("/upload", express.static(path.join(__dirname, "./src/uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: frontend_url || '*',
    method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`,
    }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 1 }  //set secure true only when use HTTPS    
}));

app.use('/', mainRouter);

server.listen(PORT, () => {
    console.log(`Connected to Server => http://localhost:${PORT}`);
});

export { __dirname };