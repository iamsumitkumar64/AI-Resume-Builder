import profileDB from "../models/profileDB.js";
import bcrypt from "bcrypt";
import { __dirname } from '../../index.js';
import { delfile } from "../services/delete_file.js";
import { generatePass } from "../services/generatePass.js";
import { sendPassEmail } from "../config/mailservice.js";
import OtpDB from "../models/otpDB.js";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Missing email or password" });
        }
        const user = await profileDB.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No User Found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!user.active) {
            return res.status(401).json({ message: "Account Deactivated Yet" });
        }
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        return res.status(200).json({
            message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
            user: req.session.user
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error during login" });
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    });
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await profileDB.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = generatePass();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OtpDB.create({ userId: user._id, otp, expiresAt, purpose: 'passwordReset' });

        await sendPassEmail(email, otp, process.env.FRONTEND_URL);

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('sendOtp error:', err);
        return res.status(500).json({ message: 'Failed to send OTP' });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

        const user = await profileDB.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otpRecord = await OtpDB.findOne({ userId: user._id, otp, purpose: 'passwordReset' });
        if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
        if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

        return res.status(200).json({ success: true, message: "OTP verified" });
    } catch (err) {
        console.error("verifyOtp error:", err);
        return res.status(500).json({ message: "Server error while verifying OTP" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) return res.status(400).json({ message: "Email, OTP, and password are required" });

        const user = await profileDB.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otpRecord = await OtpDB.findOne({ userId: user._id, otp, purpose: 'passwordReset' });
        if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
        if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        await OtpDB.deleteMany({ userId: user._id, purpose: 'passwordReset' });
        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        console.error("resetPassword error:", err);
        return res.status(500).json({ message: "Server error while resetting password" });
    }
};

export const updateProfile = async (req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({ message: "User session invalid or expired" });
    }

    try {
        let skills = [];
        try {
            skills = JSON.parse(req.body.skills || '[]');
            if (!Array.isArray(skills)) {
                throw new Error('Skills must be an array');
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: "Invalid format for skills" });
        }
        const existingUser = await profileDB.findOne({ id: req.session.user.id });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        let profilePhotoPath = existingUser.profilePhoto || '';
        if (req.file && req.file.originalname) {
            delfile(existingUser.profilePhoto, req.session.user.email);
            profilePhotoPath = req.file.originalname;
        }
        const updateData = {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            organization: req.body.organization,
            position: req.body.role,
            mobile: req.body.phoneNumber,
            city: req.body.city,
            area: req.body.area,
            introduction: req.body.introduction,
            quote: req.body.quote,
            joy: req.body.joy,
            contentLinks: req.body.contentLinks?.split('\n').filter(Boolean),
            age: req.body.age,
            experience: req.body.experience,
            skills,
            socials: {
                twitter: req.body.twitter,
                instagram: req.body.instagram,
                linkedin: req.body.linkedin,
                otherSocials: req.body.otherSocials
            },
            profilePhoto: profilePhotoPath,
            stage2: true,
            stage1: false
        };
        const updatedUser = await profileDB.findOneAndUpdate(
            { id: req.session.user.id },
            updateData,
            { new: true }
        );
        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        console.error("Profile update error:", err);
        return res.status(500).json({ message: "Profile update failed", err });
    }
};