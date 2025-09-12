import profileDB from './src/models/profileDB.js';
import { connectDB } from './DbConnect.js';
import { generatePass } from './src/services/generatePass.js';
import bcrypt from 'bcrypt';

connectDB();
const newadmin = async (email, mobile) => {
    try {
        const hashedPassword = await bcrypt.hash(mobile, 10);
        console.log(`Role: admin \nEmail: ${email} \nMobileNo: ${mobile} \nPassowrd: ${mobile}`);
        await profileDB.create({ role: "admin", email, mobile, password: hashedPassword });
        console.log("Admin created");
    } catch (err) {
        console.error("Error creating admin:", err.message);
    } finally {
        process.exit(0);
    }
};

newadmin('admin@gmail.com', '123');