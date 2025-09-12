import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        default: "user"
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },

    firstName: String,
    middleName: String,
    lastName: String,
    organization: String,
    position: String,
    mobile: String,
    city: String,
    area: String,
    introduction: String,
    quote: String,
    joy: String,
    contentLinks: {
        type: [String],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    age: Number,
    experience: Number,
    profilePhoto: {
        type: String,
        default: ''
    },
    socials: {
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        otherSocials: { type: String, default: "" }
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profileDB',
        default: null
    },
    curr_speech_stage: {
        type: Boolean,
        default: false
    },
    prof_speech_stage: {
        type: Boolean,
        default: false
    },
    review1_stage: {
        type: Boolean,
        default: false
    },
    review2_stage: {
        type: Boolean,
        default: false
    },
    review3_stage: {
        type: Boolean,
        default: false
    },
    stage1: {
        type: Boolean,
        default: true
    },
    stage2: {
        type: Boolean,
        default: false
    },
    stage3: {
        type: Boolean,
        default: false
    },
    sentforapproval: {
        type: Boolean,
        default: false
    },
    approvedByAdmin: {
        type: Number,
        default: 0
    },
    rejectionCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const profileDB = mongoose.model('ProfileDB', profileSchema);

export default profileDB;