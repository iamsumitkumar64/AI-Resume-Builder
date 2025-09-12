import React, { useRef, useState } from 'react';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import { message, Button } from 'antd';

const Record: React.FC<{ name_of_video: string; uploadApi: string; onUploadComplete?: () => void; nextRoute?: string }> = ({
    name_of_video,
    uploadApi,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const recorderRef = useRef<RecordRTC | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [blob, setBlob] = useState<Blob | null>(null);
    const [recording, setRecording] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isupload, setisUpload] = useState<boolean>(false);

    const stopCamera = () => {
        const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
        tracks?.forEach(t => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    const start = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();
        const recorder = new RecordRTC(stream, { type: 'video', mimeType: 'video/mp4' });
        recorder.startRecording();
        recorderRef.current = recorder;
        setRecording(true);
        setisUpload(false);
    };

    const stop = () => recorderRef.current?.stopRecording(() => {
        const recorded = recorderRef.current?.getBlob();
        setBlob(recorded || null);
        stopCamera();
        if (videoRef.current && recorded) {
            videoRef.current.src = URL.createObjectURL(recorded);
        }
        setRecording(false);
    });

    const handleSystemFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'video/mp4') {
            messageApi.error('Please upload a valid MP4 video.');
            return;
        }
        const url = URL.createObjectURL(file);
        setBlob(file);
        if (videoRef.current) {
            videoRef.current.src = url;
        }
        stopCamera();
    };
    const upload = async () => {
        if (isupload || !blob) return;
        setisUpload(true);

        const fixedBlob = new Blob([blob], { type: 'video/mp4' });
        const form = new FormData();
        const fieldName = name_of_video
            .trim()
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '_');
        form.append(fieldName, fixedBlob, `${fieldName}.mp4`);

        messageApi.open({
            type: 'loading',
            content: 'Video sent to upload...',
            duration: 0,
        });

        try {
            const response = await fetch(uploadApi, { method: 'POST', body: form, credentials: 'include' });
            if (!response.ok) throw new Error('Upload failed');
            messageApi.destroy();
            messageApi.success('Sent for Upload 🎉');
            stopCamera();
        } catch (err) {
            console.error('Upload error:', err);
            messageApi.destroy();
            messageApi.error('Upload Failed ❌');
        }
    };
    return (
        <>
            {contextHolder}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh' }}>
                <video
                    ref={videoRef}
                    controls
                    style={{
                        width: '500px',
                        backgroundColor: '#000',
                        borderRadius: '8px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                    }}
                />
                <div style={{
                    marginTop: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                }}>
                    <Button
                        className='text-blue-600 border-1 border-blue-600'
                        onClick={recording ? stop : start}
                    >
                        {recording ? '🛑 Stop' : '🎬 Start'}
                    </Button>
                    {blob && (
                        <>
                            <Button
                                className='text-blue-600 border-1 border-blue-600'
                                loading={isupload}
                                onClick={upload}
                            >
                                📤 Upload
                            </Button>

                            <Button
                                className='text-blue-600 border-1 border-blue-600'
                                onClick={() => {
                                    invokeSaveAsDialog(blob, `${name_of_video}.mp4`);
                                    stopCamera();
                                }}
                            >
                                💾 Download
                            </Button>
                            <Button
                                danger
                                onClick={() => {
                                    setBlob(null);
                                    stopCamera();
                                    if (videoRef.current) videoRef.current.src = '';
                                }}
                            >
                                🗑️ Delete
                            </Button>
                        </>
                    )}
                    <Button
                        className='text-blue-600 border-1 border-blue-600'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        📁 Upload from System
                    </Button>
                    <input
                        type="file"
                        accept="video/mp4"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleSystemFileUpload}
                    />
                </div>
            </div>
        </>
    );
};

export default Record;