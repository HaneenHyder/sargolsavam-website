'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Activity, Globe, Monitor, Chrome, Calendar, Eye, Shield } from 'lucide-react';
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
    login_type: string;
    user_id: string;
    created_at: string;
}

export default function InsightsPage() {
    const [stats, setStats] = useState<ViewerStats | null>(null);
    const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [loginTypeFilter, setLoginTypeFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<'created_at' | 'login_type' | 'username' | 'ip_address' | 'success'>('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleSort = (field: 'created_at' | 'login_type' | 'username' | 'ip_address' | 'success') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const fetchData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem('token');

            const statsRes = await fetch(`${API_URL}/api/admin/insights/viewers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (statsRes.ok) setStats(await statsRes.json());

            const logsRes = await fetch(`${API_URL}/api/admin/insights/logins?limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (logsRes.ok) setLoginLogs(await logsRes.json());

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
        const interval = setInterval(fetchData, 30000);
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

    const filteredLogs = loginLogs
        .filter(log => loginTypeFilter === 'all' || log.login_type === loginTypeFilter)
        .sort((a, b) => {
            let comparison = 0;

            if (sortField === 'created_at') {
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sortField === 'login_type') {
                comparison = a.login_type.localeCompare(b.login_type);
            } else if (sortField === 'username') {
                comparison = a.username.localeCompare(b.username);
            } else if (sortField === 'ip_address') {
                comparison = a.ip_address.localeCompare(b.ip_address);
            } else if (sortField === 'success') {
                comparison = (a.success === b.success) ? 0 : a.success ? -1 : 1;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Globe className="h-8 w-8 text-primary" />
                        Global Website Insights
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Monitor website traffic, visitor analytics, and all authentication activity.
                        {lastUpdated && <span className="ml-2 text-xs opacity-75">Last updated: {lastUpdated.toLocaleTimeString()}</span>}
                    </p>
                </div>
                <button onClick={fetchData} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm">
                    Refresh
                </button>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            {(!stats?.deviceStats || stats.deviceStats.length === 0) && <p className="text-sm text-gray-400">No data yet</p>}
                        </div>
                    </CardContent>
                </Card>
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
                            {(!stats?.browserStats || stats.browserStats.length === 0) && <p className="text-sm text-gray-400">No data yet</p>}
                        </div>
                    </CardContent>
                </Card>
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
                            {(!stats?.osStats || stats.osStats.length === 0) && <p className="text-sm text-gray-400">No data yet</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                                    <tr><td colSpan={2} className="py-4 text-center text-sm text-gray-400">No data yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Login Logs (All Types - Last 100)
                        </CardTitle>
                        <select
                            value={loginTypeFilter}
                            onChange={(e) => setLoginTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Types</option>
                            <option value="admin">Admin Only</option>
                            <option value="team">Team Only</option>
                            <option value="candidate">Candidate Only</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('created_at')}><div className="flex items-center gap-1">Date & Time {sortField === 'created_at' && <span className="text-primary">{sortDirection === 'asc' ? '?' : '?'}</span>}</div></th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('login_type')}><div className="flex items-center gap-1">Type {sortField === 'login_type' && <span className="text-primary">{sortDirection === 'asc' ? '?' : '?'}</span>}</div></th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('username')}><div className="flex items-center gap-1">Username/ID {sortField === 'username' && <span className="text-primary">{sortDirection === 'asc' ? '?' : '?'}</span>}</div></th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('ip_address')}><div className="flex items-center gap-1">IP Address {sortField === 'ip_address' && <span className="text-primary">{sortDirection === 'asc' ? '?' : '?'}</span>}</div></th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('success')}><div className="flex items-center gap-1">Status {sortField === 'success' && <span className="text-primary">{sortDirection === 'asc' ? '?' : '?'}</span>}</div></th>
                                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4 text-sm text-gray-700 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-2 px-4 text-sm">
                                            {log.login_type === 'admin' && (
                                                <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 font-medium text-xs uppercase">Admin</span>
                                            )}
                                            {log.login_type === 'team' && (
                                                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium text-xs uppercase">Team</span>
                                            )}
                                            {log.login_type === 'candidate' && (
                                                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-medium text-xs uppercase">Candidate</span>
                                            )}
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
                                {filteredLogs.length === 0 && (
                                    <tr><td colSpan={6} className="py-4 text-center text-sm text-gray-400">No login logs yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
