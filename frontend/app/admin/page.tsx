'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { Trophy, Users, Calendar, LogOut, BarChart3, List, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalEvents: 0, totalCandidates: 0, publishedResults: 0 });
    const [loadingStats, setLoadingStats] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const { logout } = useAuth();

    const fetchStats = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            const res = await fetch(`${apiUrl}/admin/stats`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error('Failed to fetch stats', err);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage events, candidates, and results.
                        {lastUpdated && <span className="ml-2 text-xs opacity-75">Last updated: {lastUpdated.toLocaleTimeString()}</span>}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchStats} size="sm">
                        Refresh
                    </Button>
                    <Button variant="danger" onClick={logout} size="sm" className="gap-2">
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        {loadingStats ? (
                            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.totalEvents}</div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Scheduled events</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        {loadingStats ? (
                            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Registered participants</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published Results</CardTitle>
                        <Trophy className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        {loadingStats ? (
                            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                        ) : (
                            <div className="text-2xl font-bold text-green-600">{stats.publishedResults}</div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Events declared</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:border-primary transition-colors cursor-pointer group">
                    <Link href="/admin/events">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <List size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Manage Events</h3>
                                    <p className="text-gray-500 text-sm">Create events, add participants, enter results.</p>
                                </div>
                            </div>
                            <div className="text-gray-400 group-hover:text-primary transition-colors">→</div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:border-primary transition-colors cursor-pointer group">
                    <Link href="/admin/leaderboard">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg group-hover:bg-yellow-100 transition-colors">
                                    <BarChart3 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">View Leaderboard</h3>
                                    <p className="text-gray-500 text-sm">Check live team standings and points.</p>
                                </div>
                            </div>
                            <div className="text-gray-400 group-hover:text-primary transition-colors">→</div>
                        </CardContent>
                    </Link>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <Link href="/admin/import">
                        <CardContent className="p-4 flex items-center gap-3">
                            <Upload size={20} className="text-gray-500" />
                            <span className="font-medium">Import Data</span>
                        </CardContent>
                    </Link>
                </Card>
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <Link href="/admin/committee">
                        <CardContent className="p-4 flex items-center gap-3">
                            <Users size={20} className="text-gray-500" />
                            <span className="font-medium">Manage Committee</span>
                        </CardContent>
                    </Link>
                </Card>
                {/* Add more quick links here if needed */}
            </div>
        </div>
    );
}
