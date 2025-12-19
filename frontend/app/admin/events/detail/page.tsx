'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/Card";
import { formatCategory, formatEventType } from '@/lib/utils';
// Note: Assuming these components exist based on typical Next.js project structure
// If not, I might need to mock them or strip them down, but sticking to logic update for now.

interface Event {
    id: string;
    name: string;
    category: string;
    type: string;
    status: string;
    // ... other fields
}

function EventDetailInternal() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${API_URL}/api/events/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Event not found');
                return res.json();
            })
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (!id) return <div className="p-8">No Event ID provided.</div>;
    if (loading) return <div className="p-8">Loading event...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!event) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{event.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.status === 'published' ? 'bg-green-100 text-green-800' :
                    event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {event.status.toUpperCase()}
                </span>
            </div>

            <Card>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Category</h3>
                        <p className="text-lg">{formatCategory(event.category)}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Type</h3>
                        <p className="text-lg">{formatEventType(event.type)}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Additional event details, participants, results would go here */}
            {/* Keeping it simple to match previous potential structure or lack thereof */}
        </div>
    );
}

export default function EventDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventDetailInternal />
        </Suspense>
    );
}
