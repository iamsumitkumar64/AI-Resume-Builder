import mongoose from 'mongoose';

const earlySchema = new mongoose.Schema({
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

    early_life_data: {
        Name: String,
        Birth_city: String,
        Hometown_city: String,
        Schools: {
            type: [
                {
                    name: { type: String, required: true },
                    location: { type: String, required: true }
                }
            ],
            default: []
        },
        Colleges: {
            type: [
                {
                    name: { type: String, required: true },
                    location: { type: String, required: true }
                }
            ],
            default: []
        },
        Early_life_tags: {
            type: [String],
            default: []
        }
    },

    Early_video: {
        type: String,
        default: ''
    },
    Early_speech: {
        type: String,
        default: ''
    }

}, { timestamps: true });

const earlyDB = mongoose.model('EarlyDB', earlySchema);

export default earlyDB;