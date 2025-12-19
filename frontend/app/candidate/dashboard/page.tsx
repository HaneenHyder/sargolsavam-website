'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trophy, User, Users as UsersIcon, Award, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Adjust path if needed

// Use absolute URL or env var
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Result {
    id: string;
    event_id: string;
    position: number | null;
    grade: string | null;
    points: number;
    status: string;
    event_name: string;
    event_type: string;
}

import AppealForm from "@/components/AppealForm";

const CandidateDashboard = () => {
    const router = useRouter();
    const { user, logout, loading } = useAuth(); // Adapted from reference
    const [results, setResults] = useState<Result[]>([]);
    const [medalCounts, setMedalCounts] = useState({ first: 0, second: 0, third: 0 });
    const [loadingResults, setLoadingResults] = useState(true);
    const [candidateData, setCandidateData] = useState<any>(null);
    const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (user.role === 'admin') {
                router.push("/admin/dashboard"); // Adjust admin route
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && user.role === 'candidate') {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/candidates/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error('Dashboard fetch error:', res.status, errData);
                throw new Error(errData.message || errData.error || `Failed to fetch dashboard data (${res.status})`);
            }

            const data = await res.json();
            console.log('Dashboard Data:', data);
            setCandidateData(data.candidate || {});
            setResults(Array.isArray(data.results) ? data.results : []);
            setMedalCounts(data.medalCounts || { first: 0, second: 0, third: 0 });
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoadingResults(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    const getPositionBadge = (position: number | null) => {
        const styles = {
            1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            2: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            3: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        };
        return styles[position as keyof typeof styles] || "bg-muted text-muted-foreground";
    };

    const getGradeBadge = (grade: string | null) => {
        const styles = {
            A: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            B: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            C: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            D: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        };
        return styles[grade as keyof typeof styles] || "bg-muted text-muted-foreground";
    };

    return (
        <div className="min-h-screen bg-background">
            <AppealForm isOpen={isAppealModalOpen} onClose={() => setIsAppealModalOpen(false)} />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Candidate Dashboard</h1>
                        <p className="text-muted-foreground">Welcome, {candidateData?.name || user.name}!</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Appeals Hidden Temporarily
                        <Button variant="outline" onClick={() => router.push("/candidate/appeals")}>
                            My Appeals
                        </Button>
                        <Button onClick={() => setIsAppealModalOpen(true)}>
                            File Appeal
                        </Button>
                        */}
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 border-2 border-primary/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Chest Number</p>
                                <p className="text-2xl font-bold">{candidateData?.chest_no || user?.chest_no || '-'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-2 border-secondary/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                <UsersIcon className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Team Code</p>
                                <p className="text-2xl font-bold">{candidateData?.team_code || user?.team_code || '-'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-2 border-accent/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                <Award className="h-6 w-6 text-accent" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-2">Medal Summary</p>
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-1">
                                        <Trophy className="h-4 w-4 text-yellow-500" />
                                        <span className="font-bold">{medalCounts.first}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Trophy className="h-4 w-4 text-gray-400" />
                                        <span className="font-bold">{medalCounts.second}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Trophy className="h-4 w-4 text-amber-600" />
                                        <span className="font-bold">{medalCounts.third}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-2 border-green-500/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Award className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Events Participated</p>
                                <p className="text-2xl font-bold">{results.length}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">My Event Results</h2>

                    {loadingResults ? (
                        <p className="text-center text-muted-foreground py-8">Loading results...</p>
                    ) : results.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No results published yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 whitespace-nowrap">Event Name</th>
                                        <th className="text-left py-3 px-4 whitespace-nowrap">Status</th>
                                        <th className="text-left py-3 px-4 whitespace-nowrap">Position</th>
                                        <th className="text-left py-3 px-4 whitespace-nowrap">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result) => (
                                        <tr key={result.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                            <td className="py-4 px-4 font-medium min-w-[150px]">{result.event_name}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <Badge className={
                                                    result.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                        result.status === 'Absent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                }>
                                                    {result.status === 'published' ? 'Published' :
                                                        result.status === 'Absent' ? 'Absent' : 'Pending'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                {result.position ? (
                                                    <Badge className={getPositionBadge(result.position)}>
                                                        {result.position === 1 ? '1st' : result.position === 2 ? '2nd' : '3rd'}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                {result.grade ? (
                                                    <Badge className={getGradeBadge(result.grade)}>
                                                        Grade {result.grade}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CandidateDashboard;
