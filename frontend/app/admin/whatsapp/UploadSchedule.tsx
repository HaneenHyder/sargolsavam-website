"use client";

import { useState } from 'react';
import axios from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function UploadSchedule({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [message, setMessage] = useState('');

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
            <h2 className="text-xl font-bold mb-4">1. Generate Messages</h2>

            {message && <p className={`mb-4 ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

            <div className="">
                <h3 className="font-semibold mb-2">Select Message Type to Generate:</h3>
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
