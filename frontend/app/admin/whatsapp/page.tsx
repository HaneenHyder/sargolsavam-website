"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import UploadSchedule from './UploadSchedule';
import MessageList from './MessageList';
import Link from 'next/link';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://heartfelt-unity.up.railway.app';

export default function WhatsAppPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/whatsapp/messages`);
            setMessages(res.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📲 WhatsApp Messaging System</h1>
                <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <UploadSchedule onUploadSuccess={fetchMessages} />

            <MessageList messages={messages} refresh={fetchMessages} />
        </div>
    );
}
