import profileDB from '../models/profileDB.js';
import earlyDB from '../models/earlyDB.js';
import profDB from '../models/profDB.js';
import currDB from '../models/currDB.js';
import { __dirname } from '../../index.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileQueue } from '../config/bullmq.js';
dotenv.config();

export const getUserStatus = async (req, res) => {
    try {
        const userId = req.session?.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized or session expired" });
        }

        const profile = await profileDB.findOne({ id: userId }).lean();
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        const early = await earlyDB.findOne({ profileId: profile._id }).lean();
        const prof = await profDB.findOne({ profileId: profile._id }).lean();
        const curr = await currDB.findOne({ profileId: profile._id }).lean();

        return res.status(200).json({
            stage1: profile.stage1 || false,
            stage2: profile.stage2 || false,
            stage3: profile.stage3 || false,
            review1_stage: profile.review1_stage || false,
            review2_stage: profile.review2_stage || false,
            review3_stage: profile.review3_stage || false,
            earlyVideoUploaded: !!(early?.Early_video),
            prof_speech_stage: profile.prof_speech_stage || false,
            curr_speech_stage: profile.curr_speech_stage || false,
            allVideosComplete: (!!(early?.Early_video) && !!(prof?.prof_video) && !!(curr?.curr_video)),
            sentforapproval: profile.sentforapproval,
            approvedByAdmin: profile.approvedByAdmin,
            rejectionCount: profile.rejectionCount
        });

    } catch (err) {
        console.error("getUserStatus Error:", err);
        return res.status(500).json({ message: "Failed to fetch user status", error: err.message });
    }
};

export const getExtractedVideoData = async (req, res) => {
    try {
        const userId = req.session?.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized or session expired" });
        }
        const profile = await profileDB.findOne({ id: userId }).lean();
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        const early = await earlyDB.findOne({ profileId: profile._id }).lean();
        const prof = await profDB.findOne({ profileId: profile._id }).lean();
        const curr = await currDB.findOne({ profileId: profile._id }).lean();
        const extractedData = {
            earlyLife: {
                extractedData: early?.early_life_data || null,
            },
            professionalLife: {
                extractedData: prof?.prof_life_data || null,
            },
            currentLife: {
                extractedData: curr?.curr_life_data || null,
            }
        };
        return res.status(200).json({
            message: "Extracted video data retrieved successfully",
            data: extractedData
        });

    } catch (err) {
        console.error("getExtractedVideoData Error:", err);
        return res.status(500).json({ message: "Failed to fetch extracted video data", error: err.message });
    }
};

export const RestartProfile = async (req, res) => {
    try {
        await profileDB.findOneAndUpdate(
            { id: req.body.userId },
            {
                stage1: true,
                stage2: true,
                stage3: true,
                review1_stage: true,
                review2_stage: true,
                review3_stage: true,
                prof_speech_stage: true,
                curr_speech_stage: true,
                sentforapproval: false,
                approvedByAdmin: false,
                sentforapproval: false,
                approvedByAdmin: false,
                approvedByAdmin: 0
            }
        );
        return res.status(200).json({ message: 'Restarted Your Profile' });
    } catch (err) {
        console.error("RestartProfile Error:", err);
        return res.status(500).json({ message: "Failed to restart profile", error: err.message });
    }
}

export const GetProfile = async (req, res) => {
    try {
        const userId = req.session?.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized or session expired" });
        }
        const user = await profileDB.findOne({ id: userId }).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const {
            firstName,
            middleName,
            lastName,
            organization,
            position,
            mobile: phoneNumber,
            city,
            area,
            introduction,
            quote,
            joy,
            contentLinks,
            age,
            experience,
            skills,
            profilePhoto,
            socials
        } = user;

        return res.status(200).json({
            firstName,
            middleName,
            lastName,
            organization,
            position,
            phoneNumber,
            city,
            area,
            introduction,
            quote,
            joy,
            contentLinks,
            age,
            experience,
            skills,
            profilePhoto,
            socials
        });
    } catch (err) {
        console.error("GetProfile Error:", err);
        return res.status(500).json({ message: "Failed to fetch profile", error: err.message });
    }
};

export const updatevideo = async (req, res) => {
    try {
        if (!req.file || !req.file.filename) {
            return res.status(400).json({ message: "No video file uploaded." });
        }
        const { filename } = req.file;
        const inputPath = `${__dirname}/src/uploads/${req.session.user.email}/${filename}`;
        const outputPath = `${inputPath}.mp3`;
        const userId = req.session?.user?.id;
        const userEmail = req.session?.user?.email;

        if (!userId || !userEmail) {
            return res.status(401).json({ message: "User session invalid or expired" });
        }
        const profile = await profileDB.findOne({ id: userId });
        if (!profile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        await fileQueue.add('fileQueue', {
            filename,
            inputPath,
            outputPath,
            userEmail,
            userId,
            profileId: profile._id.toString(),
        });
        const videoType = filename.includes('early') ? 'Early' : filename.includes('prof') ? 'Professional' : 'Current';
        return res.status(200).json({
            message: `${videoType} life video updated successfully`,
        });
    } catch (err) {
        console.error("Error updating video:", err);
        return res.status(500).json({ message: "Internal server error", err });
    }
};

export const updateEarlyLifeFormData = async (req, res) => {
    try {
        const userId = req.session?.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const profile = await profileDB.findOne({ id: userId });
        if (!profile) return res.status(404).json({ message: "User not found" });
        const objectUserId = new mongoose.Types.ObjectId(profile._id);
        const schools = Array.isArray(req.body.schools)
            ? req.body.schools.filter(item => item?.name && item?.location)
            : [];
        const colleges = Array.isArray(req.body.colleges)
            ? req.body.colleges.filter(item => item?.name && item?.location)
            : [];
        const updatedEarly = await earlyDB.findOneAndUpdate(
            { profileId: objectUserId },
            {
                $set: {
                    'early_life_data.Name': req.body.name ?? '',
                    'early_life_data.Birth_city': req.body.birthCity ?? '',
                    'early_life_data.Hometown_city': req.body.hometownCity ?? '',
                    'early_life_data.Schools': schools,
                    'early_life_data.Colleges': colleges,
                    'early_life_data.Early_life_tags': Array.isArray(req.body.tags) ? req.body.tags : [],
                }
            },
            { new: true, upsert: true }
        );
        if (!updatedEarly) {
            return res.status(404).json({ message: 'Early profile not found for this user.' });
        }
        await profileDB.findOneAndUpdate(
            { id: userId },
            { prof_speech_stage: true },
            { new: true }
        );
        return res.status(200).json({
            message: 'Updated Early Life successfully',
            data: updatedEarly
        });
    } catch (err) {
        console.error("Error updating Early review:", err);
        return res.status(500).json({ message: "Internal server error", err: err.message });
    }
};

export const updateProfessionalLifeFormData = async (req, res) => {
    try {
        const userId = req.session?.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const profile = await profileDB.findOne({ id: userId });
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        const {
            First_job,
            Other_roles,
            Other_companies,
            Professional_tags
        } = req.body.prof_life_data;
        let safeOtherCompanies = [];
        if (Array.isArray(Other_companies)) {
            safeOtherCompanies = Other_companies.map((entry) => {
                if (typeof entry === 'string') {
                    return {
                        companyName: entry,
                        role: '',
                        place: ''
                    };
                }

                return {
                    companyName: entry?.companyName || '',
                    role: entry?.role || '',
                    place: entry?.place || ''
                };
            });
        }
        const updated = await profDB.findOneAndUpdate(
            { profileId: profile._id },
            {
                $set: {
                    'prof_life_data.First_job': First_job,
                    'prof_life_data.Other_roles': Array.isArray(Other_roles) ? Other_roles : [],
                    'prof_life_data.Other_companies': safeOtherCompanies,
                    'prof_life_data.Professional_tags': Array.isArray(Professional_tags) ? Professional_tags : []
                }
            },
            { new: true, upsert: true }
        );
        await profileDB.findOneAndUpdate(
            { id: userId },
            { curr_speech_stage: true },
            { new: true }
        );
        return res.status(200).json({ message: "Professional life data updated", data: updated });
    } catch (err) {
        console.error("Update Prof Life Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const updateCurrentLifeFormData = async (req, res) => {
    try {
        const userId = req.session?.user?.id;
        const userEmail = req.session?.user?.email;

        if (!userId || !userEmail) {
            return res.status(401).json({ message: 'Unauthorized or session expired' });
        }

        const profile = await profileDB.findOne({ id: userId });
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { curr_life_data } = req.body;
        if (!curr_life_data) {
            return res.status(400).json({ message: 'No current life data provided' });
        }
        const {
            Current_life_summary,
            Current_cities = [],
            Current_organizations = [],
            Current_roles = [],
            Travel_cities = [],
            Current_life_tags = []
        } = curr_life_data;
        const updated = await currDB.findOneAndUpdate(
            { profileId: profile._id },
            {
                profileId: profile._id,
                email: userEmail,
                curr_life_data: {
                    Current_life_summary,
                    Current_cities,
                    Current_organizations,
                    Current_roles,
                    Travel_cities,
                    Current_life_tags
                }
            },
            { new: true, upsert: true }
        );
        await profileDB.findOneAndUpdate(
            { id: userId },
            { stage3: true, stage2: false },
            { new: true }
        );
        return res.status(200).json({
            message: 'Current life data updated successfully',
            data: updated
        });
    } catch (err) {
        console.error("updateCurrentLifeFormData Error:", err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};