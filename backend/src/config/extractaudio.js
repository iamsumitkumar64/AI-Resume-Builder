import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { createClient } from '@deepgram/sdk';
import fs from 'fs';
ffmpeg.setFfmpegPath(ffmpegPath.path);

export const extractAudio = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .setFfmpegPath(ffmpegPath.path)
            .noVideo()
            .audioCodec('libmp3lame')
            .save(outputPath)
            .on('end', () => {
                console.log('Audio extracted successfully');
                resolve();
            })
            .on('error', (err) => {
                console.error('Audio extraction error:', err);
                reject(err);
            });
    });
};

export const transcribeFile = async (file_name) => {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        fs.readFileSync(file_name),
        {
            model: "nova-3",
            smart_format: true,
        }
    );
    if (error) throw error;
    return result;
};