import { Router } from "express";
import { loginUser, logoutUser, updateProfile, sendOtp, verifyOtp, resetPassword } from "../controllers/authController.js";
import multer_config from "../config/multer.js";

const allowedTypes = ['image/jpeg', 'image/png'];
const upload = multer_config(allowedTypes);
const authRouter = Router();

authRouter.post('/login', loginUser);
authRouter.get('/logout', logoutUser);
authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/profile', upload.single('profilePhoto'), updateProfile);

export default authRouter;