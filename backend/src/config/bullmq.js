import { Queue, Worker } from 'bullmq';
import ioredis from 'ioredis';
import { analyzeAndGiveData } from './Gemini.js';
import { extractAudio } from './extractaudio.js';
import { delfile } from '../services/delete_file.js';
import profileDB from '../models/profileDB.js';
import { getPromptFormat } from '../services/getformat.js';
import { saveParsedData } from '../services/saveParsedData.js';
import { transcribeFile } from './extractaudio.js';
import { getIo } from './socket.js';

const connection = new ioredis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

export const fileQueue = new Queue('fileQueue', { connection });

const fileWorker = new Worker(
    'fileQueue',
    async job => {
        try {
            const {
                filename,
                inputPath,
                outputPath,
                userEmail,
                userId,
                profileId,
            } = job.data;

            if (!filename || !inputPath || !outputPath || !userEmail || !userId || !profileId) {
                throw new Error('Missing required job data fields.');
            }
            const profile = await profileDB.findById(profileId);
            if (!profile) {
                throw new Error(`Profile not found for ID: ${profileId}`);
            }

            await extractAudio(inputPath, outputPath);
            const deepgramResult = await transcribeFile(outputPath);
            await delfile(outputPath, userEmail);

            const transcript = deepgramResult.results.channels[0].alternatives[0].transcript;
            let format = getPromptFormat(filename);

            if (!format) {
                throw new Error(`Unrecognized filename: ${filename}`);
            }

            const ans = await analyzeAndGiveData(transcript, format);
            let jsonText = ans.response.candidates[0].content.parts[0].text.trim();

            if (jsonText.startsWith("```")) {
                jsonText = jsonText.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
            }
            const parsedData = JSON.parse(jsonText);
            await saveParsedData({
                filename,
                profile,
                userEmail,
                userId,
                transcript,
                parsedData
            });
            const id = profile.id;
            getIo().emit('videoUpload', { id, filename });
        } catch (error) {
            console.error('❌ Worker Error:', error.message);
            throw error;
        }
    },
    { connection }
);