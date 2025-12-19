'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'candidate' | 'team' | 'admin'>('candidate');
    const [formData, setFormData] = useState({ username: '', password: '', code: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                type: activeTab,
                username: (activeTab === 'admin' || activeTab === 'candidate') ? formData.username : undefined,
                password: (activeTab === 'admin' || activeTab === 'team') ? formData.password : undefined,
                code: activeTab !== 'admin' ? formData.code : undefined
            };

            // Use absolute URL or env var
            // Use absolute URL or env var
            // Use absolute URL or env var
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Update Auth Context
            login({
                id: data.id || 'temp-id', // Backend should return ID
                name: formData.username || data.name || 'User',
                role: activeTab,
                chest_no: data.chest_no,
                team_code: data.code || data.team_code
            }, data.token);

            // Redirect based on role
            if (activeTab === 'admin') router.push('/admin');
            else if (activeTab === 'team') router.push('/captain/dashboard');
            else if (activeTab === 'candidate') router.push(`/candidate/dashboard`); // Updated to dashboard

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'candidate' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('candidate')}
                        >
                            Candidate
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'team' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('team')}
                        >
                            Team Captain
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'admin' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('admin')}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md">{error}</div>}

                        {activeTab === 'candidate' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Chest Number</label>
                                    <Input
                                        placeholder="Enter Chest No (e.g., 101)"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        placeholder="Enter Full Name"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'team' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Team Code</label>
                                    <Input
                                        placeholder="Enter Team Code (e.g., 100)"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="Enter Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'admin' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Username</label>
                                    <Input
                                        placeholder="Admin Username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
