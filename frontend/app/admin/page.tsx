'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { Trophy, Users, Calendar, LogOut, BarChart3, List, Upload, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalEvents: 0, totalCandidates: 0, publishedResults: 0 });
    const [loginStats, setLoginStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const { logout } = useAuth();

    const fetchStats = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/stats`, {
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

            const resLogin = await fetch(`${API_URL}/api/admin/stats/login`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (resLogin.ok) {
                const loginData = await resLogin.json();
                setLoginStats(loginData);
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
                    <Link href="/">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Home size={16} /> Home
                        </Button>
                    </Link>
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
                            <div>
                                <div className="text-2xl font-bold text-green-600">{stats.publishedResults}</div>
                                {stats.totalEvents > 0 && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="font-medium text-green-700">{Math.round((stats.publishedResults / stats.totalEvents) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(stats.publishedResults / stats.totalEvents) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Events declared out of {stats.totalEvents}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Global Login Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Global Login Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingStats || !loginStats ? (
                            <div className="space-y-4">
                                <div className="h-12 bg-gray-100 animate-pulse rounded" />
                                <div className="h-12 bg-gray-100 animate-pulse rounded" />
                                <div className="h-12 bg-gray-100 animate-pulse rounded" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Candidate Stats */}
                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            C
                                        </div>
                                        <span className="font-medium">Candidates</span>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        <span className="text-green-600 font-medium">{loginStats.candidate?.success || 0} Success</span>
                                        <span className="text-red-600 font-medium">{loginStats.candidate?.fail || 0} Failed</span>
                                    </div>
                                </div>

                                {/* Team Stats */}
                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                            T
                                        </div>
                                        <span className="font-medium">Teams</span>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        <span className="text-green-600 font-medium">{loginStats.team?.success || 0} Success</span>
                                        <span className="text-red-600 font-medium">{loginStats.team?.fail || 0} Failed</span>
                                    </div>
                                </div>

                                {/* Admin Stats */}
                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs">
                                            A
                                        </div>
                                        <span className="font-medium">Admin</span>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        <span className="text-green-600 font-medium">{loginStats.admin?.success || 0} Success</span>
                                        <span className="text-red-600 font-medium">{loginStats.admin?.fail || 0} Failed</span>
                                    </div>
                                </div>
                            </div>
                        )}
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
        </div >
    );
}
