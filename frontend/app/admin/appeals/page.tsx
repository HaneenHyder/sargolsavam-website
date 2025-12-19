'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Appeal {
    id: string;
    event_name: string;
    reason: string;
    description: string;
    submitted_by_role: string;
    status: string;
    payment_status: string;
    submitter_name?: string;
    submitter_code?: string;
    created_at: string;
    refund_status?: string;
}

export default function AppealsPage() {
    const [appeals, setAppeals] = useState<Appeal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppeals();
    }, []);

    const fetchAppeals = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const res = await fetch(`${API_URL}/api/appeals`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch appeals');
            const data = await res.json();
            setAppeals(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load appeals');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string, refundStatus?: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const body: { status: string; refund_status?: string } = { status: newStatus };
            if (refundStatus) body.refund_status = refundStatus;

            const res = await fetch(`${API_URL}/api/appeals/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to update status');

            setAppeals(appeals.map(a => a.id === id ? { ...a, status: newStatus, refund_status: refundStatus || a.refund_status } : a));
            toast.success('Status updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-primary">Appeals Received</h1>

            <div className="grid gap-4">
                {appeals.length === 0 ? (
                    <p className="text-gray-500">No appeals received yet.</p>
                ) : (
                    appeals.map((appeal) => (
                        <Card key={appeal.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">{appeal.event_name}</CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Submitted by <span className="font-medium text-primary">{appeal.submitter_name}</span>
                                            <span className="text-xs ml-1 bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">
                                                {appeal.submitter_code}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span className="capitalize">{appeal.submitted_by_role}</span>
                                            <span className="mx-2">•</span>
                                            {new Date(appeal.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Badge variant={appeal.payment_status === 'paid' ? 'default' : 'destructive'}>
                                            Payment: {appeal.payment_status || 'Pending'}
                                        </Badge>

                                        {appeal.status === 'Resolved' && (
                                            <select
                                                className="h-8 w-36 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={appeal.refund_status || ''}
                                                onChange={(e) => handleStatusUpdate(appeal.id, appeal.status, e.target.value)}
                                            >
                                                <option value="">Refund Status</option>
                                                <option value="Refund Pending">Refund Pending</option>
                                                <option value="Refund Successful">Refund Successful</option>
                                            </select>
                                        )}

                                        <select
                                            className="h-8 w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={appeal.status}
                                            onChange={(e) => handleStatusUpdate(appeal.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Reason:</span>
                                        <p className="text-gray-600 dark:text-gray-400">{appeal.reason}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Description:</span>
                                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{appeal.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
