"use client";

import { useState } from 'react';
import axios from 'axios';

interface Message {
    id: string;
    judge_name: string;
    whatsapp_number: string;
    message_content: string;
    status: string;
    type: string;
    created_at: string;
}

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://heartfelt-unity.up.railway.app';

export default function MessageList({ messages, refresh }: { messages: Message[], refresh: () => void }) {
    const [filter, setFilter] = useState('Pending');

    const filteredMessages = messages.filter(m => m.status === filter);

    const markAsSent = async (id: string, whatsappNumber: string, content: string) => {
        // Open WhatsApp Web
        const encodedText = encodeURIComponent(content);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');

        // Mark as sent in backend
        try {
            await axios.post(`${NEXT_PUBLIC_API_URL}/api/whatsapp/messages/${id}/send`);
            refresh();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Message Queue</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setFilter('Pending')}
                        className={`px-3 py-1 rounded ${filter === 'Pending' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
                    >
                        Pending ({messages.filter(m => m.status === 'Pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('Sent')}
                        className={`px-3 py-1 rounded ${filter === 'Sent' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
                    >
                        Sent ({messages.filter(m => m.status === 'Sent').length})
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judge</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Preview</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMessages.map((msg) => (
                            <tr key={msg.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {msg.judge_name}<br />
                                    <span className="text-gray-500 text-xs">{msg.whatsapp_number}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase">{msg.type}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={msg.message_content}>
                                    {msg.message_content.substring(0, 50)}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {msg.status === 'Pending' ? (
                                        <button
                                            onClick={() => markAsSent(msg.id, msg.whatsapp_number, msg.message_content)}
                                            className="text-emerald-600 hover:text-emerald-900 font-bold bg-emerald-50 px-3 py-1 rounded"
                                        >
                                            🚀 Send on WhatsApp
                                        </button>
                                    ) : (
                                        <span className="text-gray-400">✅ Sent</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredMessages.length === 0 && <p className="text-center py-4 text-gray-500">No messages found.</p>}
            </div>
        </div>
    );
}
