'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCategory } from "@/lib/utils";
import { Trophy, Award, Target, Users, User, MapPin, Medal } from 'lucide-react';

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

        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        fetch(`${API_URL}/api/candidates/${chest_no}`)
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

    if (!chest_no) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <User className="h-16 w-16 text-gray-300 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-700">No Chest Number Provided</h2>
                    <p className="text-gray-500">Please provide a valid chest number to view your profile.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!candidate) return null;

    const wins = candidate.participations.filter(p => p.status === 'Winner').length;
    const firstPlaces = candidate.participations.filter(p => p.position === 1).length;
    const secondPlaces = candidate.participations.filter(p => p.position === 2).length;
    const thirdPlaces = candidate.participations.filter(p => p.position === 3).length;

    const getPositionMedal = (position: number | null) => {
        if (position === 1) return '🥇';
        if (position === 2) return '🥈';
        if (position === 3) return '🥉';
        return null;
    };

    const getStatusColor = (status: string) => {
        if (status === 'Winner') return 'bg-green-100 text-green-800 border-green-300';
        return 'bg-gray-100 text-gray-700 border-gray-300';
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Enhanced Profile Card */}
            <Card className="overflow-hidden border-2 shadow-lg">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white">
                                {candidate.name.charAt(0)}
                            </div>
                            {wins > 0 && (
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg border-2 border-white flex items-center gap-1">
                                    <Trophy className="h-3 w-3" />
                                    {wins}
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <h1 className="text-4xl font-bold text-gray-900">{candidate.name}</h1>
                            <p className="text-lg text-gray-600">
                                Chest No: <span className="font-mono font-bold text-primary text-xl">{candidate.chest_no}</span>
                            </p>

                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span className="font-semibold">Team {candidate.team_code}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                                    <Target className="h-4 w-4 text-primary" />
                                    <span className="font-semibold">{formatCategory(candidate.category)}</span>
                                </div>
                                {candidate.role && (
                                    <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-sm border border-blue-300">
                                        <Award className="h-4 w-4" />
                                        <span className="font-semibold">{candidate.role}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Target className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{candidate.participations.length}</div>
                        <p className="text-sm text-gray-500 mt-1">Total Events</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Trophy className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-green-600">{wins}</div>
                        <p className="text-sm text-gray-500 mt-1">Total Wins</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Medal className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-600">{firstPlaces}</div>
                        <p className="text-sm text-gray-500 mt-1">Gold Medals</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Award className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-3xl font-bold text-purple-600">{secondPlaces + thirdPlaces}</div>
                        <p className="text-sm text-gray-500 mt-1">Other Medals</p>
                    </CardContent>
                </Card>
            </div>

            {/* Participations Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-1 bg-primary rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900">My Participations</h2>
                </div>

                {candidate.participations.length === 0 ? (
                    <Card className="border-2 border-dashed">
                        <CardContent className="p-12 text-center">
                            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Participations Yet</h3>
                            <p className="text-gray-500">You haven't participated in any events yet. Check back soon!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {candidate.participations.map((p, idx) => (
                            <Card
                                key={idx}
                                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Trophy className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{p.event_name}</h3>
                                                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                                        <span className="bg-gray-100 px-2 py-1 rounded">{p.event_type}</span>
                                                        <span className="bg-gray-100 px-2 py-1 rounded">{p.item_type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`px-4 py-2 rounded-lg font-bold border-2 ${getStatusColor(p.status)}`}>
                                                {p.status}
                                            </div>
                                            {p.status === 'Winner' && (
                                                <div className="flex items-center gap-3 text-sm">
                                                    {p.position && (
                                                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200">
                                                            <span className="text-2xl">{getPositionMedal(p.position)}</span>
                                                            <span className="font-semibold text-yellow-900">Position {p.position}</span>
                                                        </div>
                                                    )}
                                                    {p.grade && (
                                                        <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                                                            <span className="font-semibold text-blue-900">Grade: {p.grade}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CandidatePage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            </div>
        }>
            <CandidateInternal />
        </Suspense>
    );
}
