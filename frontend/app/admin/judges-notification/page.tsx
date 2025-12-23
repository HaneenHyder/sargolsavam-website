'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Phone, MessageCircle } from 'lucide-react';

interface ScheduleItem {
    id: string;
    date: string;
    time: string;
    stage: string;
    event_name: string;
    category: string;
}

interface Judge {
    id: string;
    name: string;
    phone: string;
    schedule: ScheduleItem[];
}

export default function JudgesNotificationPage() {
    const [judges, setJudges] = useState<Judge[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJudges = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || 'http://localhost:5000/api';
                const response = await fetch(`${API_URL}/judges`);
                if (response.ok) {
                    const data = await response.json();
                    setJudges(data);
                } else {
                    console.error('Failed to fetch judges');
                }
            } catch (error) {
                console.error('Error fetching judges:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJudges();
    }, []);

    const sendWhatsApp = (judge: Judge) => {
        if (!judge.phone) {
            alert('Phone number not available');
            return;
        }

        // Clean phone number
        const phone = judge.phone.replace(/\D/g, '');

        // Construct message
        let message = `*Assalamu Alaikum ${judge.name},*\n\nHere is your judging schedule for Sargolsavam:\n\n`;

        if (judge.schedule && judge.schedule.length > 0) {
            judge.schedule.forEach((item) => {
                message += `📅 *${item.date}*\n`;
                message += `⏰ ${item.time}\n`;
                message += `📍 ${item.stage}\n`;
                message += `🎤 ${item.event_name} (${item.category})\n\n`;
            });
        } else {
            message += "No events assigned yet.\n";
        }

        message += "Please reach out if you have any questions.\n\nRegards,\n*Sargolsavam Committee*";

        // Open WhatsApp
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const filteredJudges = judges.filter(judge =>
        judge.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading judges...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Judges Notification</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Send schedule notifications to judges via WhatsApp
                </p>
            </div>

            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search judges..."
                    className="flex-1 p-2 border rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJudges.map((judge) => (
                    <Card key={judge.id} className="flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center justify-between">
                                {judge.name}
                            </CardTitle>
                            {judge.phone && (
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <Phone size={14} />
                                    {judge.phone}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col pt-0">
                            <div className="flex-1 mt-4">
                                <h4 className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                                    <Users size={14} />
                                    Assignments ({judge.schedule ? judge.schedule.length : 0})
                                </h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {judge.schedule && judge.schedule.map((item, idx) => (
                                        <div key={idx} className="text-xs bg-gray-50 p-2 rounded border border-gray-100">
                                            <div className="font-medium text-gray-900">{item.event_name}</div>
                                            <div className="text-gray-500 flex justify-between mt-1">
                                                <span>{item.stage}</span>
                                                <span className={`px-1.5 rounded ${item.category.includes('SNR') ? 'bg-blue-100 text-blue-700' :
                                                    item.category.includes('JNR') ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>{item.category}</span>
                                            </div>
                                            <div className="text-gray-400 mt-1 text-[10px]">{item.date} • {item.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => sendWhatsApp(judge)}
                                className="w-full mt-6 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors font-medium"
                            >
                                <MessageCircle size={18} />
                                Send Schedule on WhatsApp
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredJudges.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No judges found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
}
