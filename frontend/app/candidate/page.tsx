'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCategory } from "@/lib/utils";

interface Participation {
    event_name: string;
    event_type: string;
    item_type: string;
    status: string;
    position: number | null;
    grade: string | null;
}

interface Candidate {
    name: string;
    chest_no: string;
    team_code: string;
    category: string;
    role?: string;
    participations: Participation[];
}

function CandidateInternal() {
    const searchParams = useSearchParams();
    const chest_no = searchParams.get('chest_no');

    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!chest_no) {
            setLoading(false);
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        fetch(`${apiUrl}/candidates/${chest_no}`)
            .then(res => {
                if (!res.ok) throw new Error('Candidate not found');
                return res.json();
            })
            .then(data => {
                setCandidate(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [chest_no]);

    if (!chest_no) return <div className="text-center py-10">No Chest Number provided.</div>;
    if (loading) return <div className="text-center py-10">Loading profile...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!candidate) return null;

    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {candidate.name.charAt(0)}
                    </div>
                    <div className="text-center md:text-left space-y-1">
                        <h1 className="text-3xl font-bold">{candidate.name}</h1>
                        <p className="text-gray-500">Chest No: <span className="font-mono font-bold text-black">{candidate.chest_no}</span></p>
                        <div className="flex gap-4 justify-center md:justify-start text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded">Team {candidate.team_code}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{formatCategory(candidate.category)}</span>
                            {candidate.role && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{candidate.role}</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Participations</h2>
                <div className="grid gap-4">
                    {candidate.participations.length === 0 && <p className="text-gray-500">No participations yet.</p>}
                    {candidate.participations.map((p, idx) => (
                        <Card key={idx}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold">{p.event_name}</h3>
                                    <p className="text-sm text-gray-500">{p.event_type} | {p.item_type}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold ${p.status === 'Winner' ? 'text-green-600' : 'text-gray-600'}`}>
                                        {p.status}
                                    </div>
                                    {p.status === 'Winner' && (
                                        <div className="text-sm">
                                            {p.position && <span>Position: {p.position}</span>}
                                            {p.grade && <span className="ml-2">Grade: {p.grade}</span>}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function CandidatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CandidateInternal />
        </Suspense>
    );
}
