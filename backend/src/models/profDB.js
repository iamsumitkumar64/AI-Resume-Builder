import mongoose from 'mongoose';

const profSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfileDB',
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    prof_life_data: {
        First_job: String,
        Other_roles: {
            type: [String],
            default: []
        },
        Other_companies: {
            type: [
                {
                    companyName: { type: String, required: true },
                    role: { type: String, required: true },
                    place: { type: String, required: true }
                }
            ],
            default: []
        },
        Professional_tags: {
            type: [String],
            default: []
        }
    },

    prof_video: {
        type: String,
        default: ''
    },
    prof_video_duplicate: {
        type: String,
        default: ''
    },
    Prof_speech: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const profDB = mongoose.model('ProfDB', profSchema);
export default profDB;