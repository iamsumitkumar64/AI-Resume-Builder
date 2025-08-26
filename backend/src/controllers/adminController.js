import profileDB from '../models/profileDB.js';
import earlyDB from '../models/earlyDB.js';
import profDB from '../models/profDB.js';
import currDB from '../models/currDB.js';
import fs from 'fs/promises';
import { __dirname } from '../../index.js';
import { generatePass } from '../services/generatePass.js';
import bcrypt from "bcrypt";
import { sendPassEmail } from '../config/mailservice.js';
import { getIo } from '../config/socket.js';

export const Getadmins = async (req, res) => {
    try {
        const allAdmins = await profileDB.find({ role: 'admin' }, {
            _id: 0,
            email: 1,
            mobile: 1,
            role: 1,
            active: 1
        });
        if (!allAdmins || allAdmins.length === 0) {
            return res.status(404).json({ message: 'No Admins Found' });
        }
        return res.status(200).json({
            message: `Request success`,
            allAdmins
        });
    } catch (err) {
        console.error("Admin fetch error:", err);
        return res.status(500).json({ message: 'Request Failed' });
    }
};

export const CametoApprove = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            console.warn("Approval failed: Missing userId");
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const profile = await profileDB.findOneAndUpdate(
            { id: userId },
            {
                stage1: false,
                stage2: false,
                stage3: true,
                review1_stage: false,
                review2_stage: false,
                review3_stage: false,
                prof_speech_stage: false,
                curr_speech_stage: false,
                sentforapproval: true,
                approvedByAdmin: 0
            }
        );
        if (!profile) {
            console.warn(`Approval failed: No profile found for userId: ${userId}`);
            return res.status(404).json({ success: false, message: "User not found" });
        }
        getIo().emit('CameToApprove', { userId });
        return res.status(200).json({ success: true, message: "Approval request sent" });
    } catch (err) {
        console.error("Approveprofile error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during approval",
            error: err.message || "Unknown error"
        });
    }
};

export const AddUsers = async (req, res) => {
    try {
        const new_password = generatePass();
        sendPassEmail(req.body.email, new_password, process.env.FRONTEND_URL);
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await profileDB.create({
            role: "user",
            email: req.body.email,
            mobile: req.body.mobile,
            CreatedBy: req.session.user.id,
            password: hashedPassword
        });
        return res.status(200).json({ message: 'User Account Created successfully' });
    }
    catch (err) {
        console.error("Admin fetch error:", err);
        return res.status(500).json({ message: 'Request Failed' });
    }
};

export const DeleteUsers = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId || userId.length < 10) {
            return res.status(400).json({ message: "Invalid User ID" });
        }
        const deletedUser = await profileDB.findOneAndDelete({ id: userId });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        await earlyDB.deleteMany({ profileId: deletedUser._id });
        await profDB.deleteMany({ profileId: deletedUser._id });
        await currDB.deleteMany({ profileId: deletedUser._id });
        const folderPath = `${__dirname}/src/uploads/${deletedUser.email}`;
        await fs.rm(folderPath, { recursive: true, force: true });
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete user error:", err);
        return res.status(500).json({ message: "Deletion failed", error: err.message });
    }
};

export const ApproveProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId || userId.length < 10) {
            return res.status(400).json({ message: "Invalid User ID" });
        }
        // const user = await profileDB.findOneAndUpdate({ id: userId }, { approvedByAdmin: 1 });
        const user = await profileDB.findOneAndUpdate(
            { id: userId, rejectionCount: { $lt: 3 }, approvedByAdmin: { $ne: 1 } },
            { $set: { approvedByAdmin: 1 } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        getIo().emit("approvalAccept", { userId });
        return res.status(200).json({ message: "User Approved successfully" });
    } catch (err) {
        console.error("Approve user error:", err);
        return res.status(500).json({ message: "Approval failed", error: err.message });
    }
};

export const RejectProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId || userId.length < 10) {
            return res.status(400).json({ message: "Invalid User ID" });
        }
        const user = await profileDB.findOneAndUpdate({ id: userId }, { approvedByAdmin: 2, sentforapproval: false, $inc: { rejectionCount: 1 } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        getIo().emit("approvalReject", { userId });
        return res.status(200).json({ message: "User Approved successfully" });
    } catch (err) {
        console.error("Approve user error:", err);
        return res.status(500).json({ message: "Approval failed", error: err.message });
    }
};

export const AllUsers = async (req, res) => {
    try {
        const users = await profileDB.find(
            { role: 'user' },
            {
                role: 1,
                email: 1,
                mobile: 1,
                createdAt: 1,
                id: 1,
                active: 1,
                sentforapproval: 1,
                approvedByAdmin: 1,
                rejectionCount: 1,
                _id: 0
            }
        );

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No Users Found' });
        }

        return res.status(200).json({ message: 'Fetched Success', users });
    } catch (err) {
        console.error("AllUsers error:", err);
        return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

// export const AllUsers = async (req, res) => {
//     try {
//         const users = await profileDB.find(
//             // { CreatedBy: req.session.user.id },
//             { role: 'user' },
//             {
//                 rejectionCount: 1,
//                 password: 0,
//                 __v: 0,
//                 firstName: 0,
//                 middleName: 0,
//                 lastName: 0,
//                 organization: 0,
//                 city: 0,
//                 area: 0,
//                 introduction: 0,
//                 quote: 0,
//                 joy: 0,
//                 contentLinks: 0,
//                 skills: 0,
//                 age: 0,
//                 experience: 0,
//                 profilePhoto: 0,
//                 socials: 0,
//                 profileComplete: 0,
//                 updatedAt: 0,
//                 CreatedBy: 0
//             }
//         );
//         if (!users) {
//             return res.status(404).json({ message: 'No User Exists' });
//         }
//         return res.status(200).json({ message: 'Fetched Success', users });
//     } catch (err) {
//         return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
//     }
// };

export const AllapproveUsers = async (req, res) => {
    try {
        const users = await profileDB.find(
            { role: 'user', approvedByAdmin: 1 },
            {
                password: 0,
                __v: 0,
                firstName: 0,
                middleName: 0,
                lastName: 0,
                organization: 0,
                city: 0,
                area: 0,
                introduction: 0,
                quote: 0,
                joy: 0,
                contentLinks: 0,
                skills: 0,
                age: 0,
                experience: 0,
                profilePhoto: 0,
                socials: 0,
                profileComplete: 0,
                updatedAt: 0,
                CreatedBy: 0
            }
        );
        if (!users) {
            return res.status(404).json({ message: 'No Users Exists' });
        }
        return res.status(200).json({ message: 'Fetched Community Success', users });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

export const Activateornot = async (req, res) => {
    try {
        const user = await profileDB.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await profileDB.findOneAndUpdate(
            { id: req.params.id },
            { $set: { active: !user.active } },
            { new: true }
        );
        return res.status(200).json({
            message: `User successfully ${updatedUser.active ? 'activated' : 'deactivated'}`
        });
    } catch (err) {
        console.error("Activate/deactivate error:", err);
        return res.status(500).json({ message: 'Failed to update user status' });
    }
};
export const ProfileUser = async (req, res) => {
    try {
        const profile = await profileDB.findOne({ id: req.params.id }).lean();
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        const [early, curr, prof] = await Promise.all([
            earlyDB.findOne({ profileId: profile._id }).lean(),
            currDB.findOne({ profileId: profile._id }).lean(),
            profDB.findOne({ profileId: profile._id }).lean(),
        ]);
        const filteredData = {
            email: profile.email,
            firstName: profile.firstName,
            middleName: profile.middleName,
            lastName: profile.lastName,
            organization: profile.organization,
            position: profile.position,
            mobile: profile.mobile,
            city: profile.city,
            area: profile.area,
            introduction: profile.introduction,
            quote: profile.quote,
            joy: profile.joy,
            contentLinks: profile.contentLinks,
            skills: profile.skills,
            age: profile.age,
            experience: profile.experience,
            profilePhoto: profile.profilePhoto,
            socials: profile.socials,
            Early_video: early?.Early_video || '',
            early_life_data: early?.early_life_data || {},
            curr_video: curr?.curr_video || '',
            curr_life_data: curr?.curr_life_data || {},
            prof_video: prof?.prof_video || '',
            prof_life_data: prof?.prof_life_data || {},
        };
        return res.status(200).json({ data: filteredData });
    } catch (err) {
        console.error("Profile fetch error:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};