import mongoose from 'mongoose';

const currSchema = new mongoose.Schema({
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

    curr_life_data: {
        Current_life_summary: String,
        Current_cities: {
            type: [String],
            default: []
        },
        Current_organizations: {
            type: [String],
            default: []
        },
        Current_roles: {
            type: [String],
            default: []
        },
        Travel_cities: {
            type: [String],
            default: []
        },
        Current_life_tags: {
            type: [String],
            default: []
        }
    },

    curr_video: {
        type: String,
        default: ''
    },
    curr_video_duplicate: {
        type: String,
        default: ''
    },
    Curr_speech: {
        type: String,
        default: ''
    }

}, { timestamps: true });

const currDB = mongoose.model('CurrDB', currSchema);

export default currDB;