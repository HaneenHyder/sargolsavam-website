'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart, Users, Activity, Globe, Monitor, Chrome, Calendar, Eye, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface ViewerStats {
    totalViews: number;
    uniqueVisitors: number;
    uniqueSessions: number;
    recentViews: number;
    deviceStats: { device_type: string; count: string }[];
    browserStats: { browser: string; count: string }[];
    osStats: { os: string; count: string }[];
    popularPages: { page_url: string; views: string }[];
}

interface LoginLog {
    id: number;
    admin_id: number | null;
    username: string;
    ip_address: string;
    user_agent: string;
    success: boolean;
    failure_reason: string | null;
    created_at: string;
}

export default function InsightsPage() {
    const [stats, setStats] = useState<ViewerStats | null>(null);
    const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');

            // Fetch viewer stats
            const statsRes = await fetch(`${API_URL}/api/admin/insights/viewers`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // Fetch login logs
            const logsRes = await fetch(`${API_URL}/api/admin/insights/logins?limit=50`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setLoginLogs(logsData);
            }

            setLastUpdated(new Date());
        } catch (err) {
            console.error('Failed to fetch insights:', err);
            toast.error('Failed to load insights data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading insights...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart className="h-8 w-8 text-primary" />
                        Insights & Analytics
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Monitor website traffic and authentication activity.
                        {lastUpdated && <span className="ml-2 text-xs opacity-75">Last updated: {lastUpdated.toLocaleTimeString()}</span>}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                    Refresh
                </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalViews.toLocaleString() || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">All time page views</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.uniqueVisitors.toLocaleString() || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Unique IP addresses</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                        <Activity className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.uniqueSessions.toLocaleString() || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Unique sessions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Views</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.recentViews.toLocaleString() || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
                    </CardContent>
                </Card>
            </div>

            {/* Viewer Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Device Types */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            Device Types
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats?.deviceStats.map((device, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm capitalize text-gray-700">{device.device_type || 'Desktop'}</span>
                                    <span className="text-sm font-semibold text-primary">{parseInt(device.count).toLocaleString()}</span>
                                </div>
                            ))}
                            {(!stats?.deviceStats || stats.deviceStats.length === 0) && (
                                <p className="text-sm text-gray-400">No data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Browsers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Chrome className="h-5 w-5" />
                            Browsers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats?.browserStats.slice(0, 5).map((browser, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 truncate">{browser.browser}</span>
                                    <span className="text-sm font-semibold text-primary">{parseInt(browser.count).toLocaleString()}</span>
                                </div>
                            ))}
                            {(!stats?.browserStats || stats.browserStats.length === 0) && (
                                <p className="text-sm text-gray-400">No data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Operating Systems */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Operating Systems
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats?.osStats.slice(0, 5).map((os, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 truncate">{os.os}</span>
                                    <span className="text-sm font-semibold text-primary">{parseInt(os.count).toLocaleString()}</span>
                                </div>
                            ))}
                            {(!stats?.osStats || stats.osStats.length === 0) && (
                                <p className="text-sm text-gray-400">No data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Popular Pages */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Popular Pages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Page URL</th>
                                    <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.popularPages.map((page, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4 text-sm text-gray-700">{page.page_url}</td>
                                        <td className="py-2 px-4 text-sm text-right font-semibold text-primary">{parseInt(page.views).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {(!stats?.popularPages || stats.popularPages.length === 0) && (
                                    <tr>
                                        <td colSpan={2} className="py-4 text-center text-sm text-gray-400">No data yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Login Logs */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Login Logs (Last 50)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Date & Time</th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Username</th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">IP Address</th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loginLogs.map((log) => (
                                    <tr key={log.id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4 text-sm text-gray-700 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-2 px-4 text-sm text-gray-700">{log.username}</td>
                                        <td className="py-2 px-4 text-sm text-gray-600 font-mono">{log.ip_address}</td>
                                        <td className="py-2 px-4 text-sm">
                                            {log.success ? (
                                                <span className="px-2 py-1 rounded bg-green-100 text-green-800 font-medium">Success</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded bg-red-100 text-red-800 font-medium">Failed</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 text-sm text-gray-600">{log.failure_reason || '-'}</td>
                                    </tr>
                                ))}
                                {loginLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center text-sm text-gray-400">No login logs yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
