'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface TeamMember {
    name: string;
    chest_no: string;
    category: string;
    role?: string;
}

interface Team {
    code: string;
    name: string;
    points: number;
    members: TeamMember[];
}

function TeamInternal() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!code) {
            setLoading(false);
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${API_URL}/api/teams/${code}`)
            .then(res => {
                if (!res.ok) throw new Error('Team not found');
                return res.json();
            })
            .then(data => {
                setTeam(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [code]);

    if (!code) return <div className="text-center py-10">No Team Code provided.</div>;
    if (loading) return <div className="text-center py-10">Loading team...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!team) return null;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl flex justify-between items-center">
                        <span>{team.name} ({team.code})</span>
                        <span className="bg-primary text-white px-4 py-2 rounded-full text-lg">
                            {team.points} Points
                        </span>
                    </CardTitle>
                </CardHeader>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Team Members</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {team.members.map((member, idx) => (
                        <Card key={idx}>
                            <CardContent className="p-4">
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <div className="text-sm text-gray-500 mt-1">
                                    <p>Chest No: {member.chest_no}</p>
                                    <p>Category: {member.category}</p>
                                    {member.role && <p className="text-blue-600 mt-1">{member.role}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function TeamPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TeamInternal />
        </Suspense>
    );
}
