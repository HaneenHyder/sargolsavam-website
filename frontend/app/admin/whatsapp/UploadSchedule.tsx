"use client";

import { useState } from 'react';
import axios from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function UploadSchedule({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${NEXT_PUBLIC_API_URL}/api/whatsapp/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Schedule uploaded successfully!');
            setFile(null);
            onUploadSuccess();
        } catch (error: any) {
            setMessage('Upload failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleGenerate = async (type: string) => {
        try {
            const res = await axios.post(`${NEXT_PUBLIC_API_URL}/api/whatsapp/generate`, { type });
            setMessage(`Generated ${res.data.count} messages for ${type}`);
            onUploadSuccess(); // Refresh list
        } catch (error: any) {
            setMessage('Generation failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">1. Import Schedule & Generate Messages</h2>

            <div className="flex items-center gap-4 mb-4">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-emerald-50 file:text-emerald-700
                        hover:file:bg-emerald-100"
                />
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
                >
                    {uploading ? 'Uploading...' : 'Upload CSV'}
                </button>
            </div>

            {message && <p className={`mb-4 ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

            <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Generate Messages:</h3>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleGenerate('initial_info')} className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">Initial Info</button>
                    <button onClick={() => handleGenerate('morning_schedule')} className="bg-purple-100 text-purple-800 px-3 py-1 rounded hover:bg-purple-200">Morning Schedule</button>
                    <button onClick={() => handleGenerate('pre_event')} className="bg-orange-100 text-orange-800 px-3 py-1 rounded hover:bg-orange-200">Pre-Event Reminder</button>
                    <button onClick={() => handleGenerate('final_thank_you')} className="bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200">Final Thank You</button>
                </div>
            </div>
        </div>
    );
}
