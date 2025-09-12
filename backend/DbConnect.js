import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const dbURI = `${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`;

export const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB =>', dbURI);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};