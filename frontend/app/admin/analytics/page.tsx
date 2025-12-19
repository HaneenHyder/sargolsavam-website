'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, Users } from 'lucide-react';

interface AnalyticsStats {
    totalViews: number;
    uniqueVisitors: number;
    recentVisits: {
        id: string;
        page_url: string;
        ip_address: string;
        created_at: string;
    }[];
    viewsOverTime: {
        date: string;
        count: string;
    }[];
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;

        if (user?.role !== 'admin') {
            router.push('/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                // Helper to normalize if needed, though we expect API_URL to be base
                const baseUrl = API_URL;

                const response = await fetch(`${baseUrl}/api/admin/analytics`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, router, authLoading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) return <div>Failed to load stats</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews}</div>
                        <p className="text-xs text-muted-foreground">All time views</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
                        <p className="text-xs text-muted-foreground">Distinct IP addresses</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.recentVisits.map((visit) => (
                                <div key={visit.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{visit.page_url}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(visit.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-gray-500">
                                        {visit.ip_address}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Views Last 7 Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.viewsOverTime.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{new Date(item.date).toLocaleDateString()}</span>
                                    <span className="text-sm text-gray-600">{item.count} views</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
