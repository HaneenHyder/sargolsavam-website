'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";

interface Appeal {
    id: string;
    event_name: string;
    reason: string;
    description: string;
    status: string;
    payment_status: string;
    created_at: string;
    refund_status?: string;
}

export default function CandidateAppealsPage() {
    const [appeals, setAppeals] = useState<Appeal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyAppeals();
    }, []);

    const fetchMyAppeals = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/appeals/my-appeals`, {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">My Appeals</h1>
            </div>

            <div className="grid gap-4">
                {appeals.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground">
                        <p>You haven't submitted any appeals yet.</p>
                    </Card>
                ) : (
                    appeals.map((appeal) => (
                        <Card key={appeal.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">{appeal.event_name}</CardTitle>
                                        <p className="text-sm text-gray-500">
                                            Submitted on {new Date(appeal.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant={appeal.payment_status === 'paid' ? 'default' : 'destructive'}>
                                            Payment: {appeal.payment_status || 'Pending'}
                                        </Badge>
                                        <Badge variant={appeal.status === 'Resolved' ? 'default' : appeal.status === 'Rejected' ? 'destructive' : 'secondary'}>
                                            {appeal.status}
                                        </Badge>
                                        {appeal.refund_status && (
                                            <Badge variant={appeal.refund_status === 'Refund Successful' ? 'default' : 'outline'}>
                                                {appeal.refund_status}
                                            </Badge>
                                        )}
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
