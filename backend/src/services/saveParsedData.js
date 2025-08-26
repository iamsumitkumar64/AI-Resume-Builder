import earlyDB from '../models/earlyDB.js';
import profDB from '../models/profDB.js';
import currDB from '../models/currDB.js';
import profileDB from '../models/profileDB.js';

export const saveParsedData = async ({ filename, profile, userEmail, userId, transcript, parsedData }) => {
    if (filename.includes('early')) {
        await earlyDB.findOneAndUpdate(
            { profileId: profile._id },
            {
                profileId: profile._id,
                email: userEmail,
                early_life_data: parsedData,
                Early_video: filename,
                Early_video_duplicate: filename,
                Early_speech: transcript,
            },
            { upsert: true, new: true }
        );
        await profileDB.findOneAndUpdate(
            { id: userId },
            { review1_stage: true },
            { new: true }
        );

    } else if (filename.includes('prof')) {
        await profDB.findOneAndUpdate(
            { profileId: profile._id },
            {
                profileId: profile._id,
                email: userEmail,
                prof_life_data: parsedData,
                prof_video: filename,
                prof_video_duplicate: filename,
                Prof_speech: transcript,
            },
            { upsert: true, new: true }
        );
        await profileDB.findOneAndUpdate(
            { id: userId },
            { review2_stage: true },
            { new: true }
        );

    } else if (filename.includes('curr')) {
        await currDB.findOneAndUpdate(
            { profileId: profile._id },
            {
                profileId: profile._id,
                email: userEmail,
                curr_life_data: parsedData,
                curr_video: filename,
                curr_video_duplicate: filename,
                Curr_speech: transcript,
            },
            { upsert: true, new: true }
        );
        await profileDB.findOneAndUpdate(
            { id: userId },
            { review3_stage: true },
            { new: true }
        );
    }
}