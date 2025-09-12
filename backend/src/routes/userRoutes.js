import { Router } from "express";
import {
    GetProfile,
    updatevideo,
    getUserStatus,
    getExtractedVideoData,
    updateEarlyLifeFormData,
    updateProfessionalLifeFormData,
    updateCurrentLifeFormData,
    RestartProfile
} from "../controllers/userController.js";
import multer_config from "../config/multer.js";
import isSessionAuth from "../middlewares/session.js";

const userRouter = Router();
const videoMimeTypes = [
    'video/webm',
    'video/mp4',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'application/octet-stream'
];
const upload = multer_config(videoMimeTypes);

userRouter.get('/profile', GetProfile);
userRouter.post('/restart', RestartProfile);

userRouter.get('/status', isSessionAuth, getUserStatus);
userRouter.get('/extracted-data', isSessionAuth, getExtractedVideoData);

userRouter.post('/earlyvideo', upload.single('early_life'), updatevideo);
userRouter.post('/profvideo', upload.single('professional_life'), updatevideo);
userRouter.post('/currvideo', upload.single('current_life'), updatevideo);

userRouter.post('/early-life-data', updateEarlyLifeFormData);
userRouter.post('/professional-life-data', updateProfessionalLifeFormData);
userRouter.post('/current-life-data', updateCurrentLifeFormData);

export default userRouter;