'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Users, Trophy, Award, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatCategory } from "@/lib/utils";

interface Result {
    id: string;
    event_id: string;
    candidate_id: string | null;
    position: number;
    grade: string;
    points: number;
    event_name: string;
    event_type: string;
    item_type: string;
    candidate_name: string | null;
    chest_no: string | null;
}

import AppealForm from "@/components/AppealForm";

const CaptainDashboard = () => {
    const router = useRouter();
    const { user, logout, loading } = useAuth();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [teamStrength, setTeamStrength] = useState(0);
    const [results, setResults] = useState<Result[]>([]);
    const [medalCounts, setMedalCounts] = useState({ first: 0, second: 0, third: 0 });
    const [totalPoints, setTotalPoints] = useState(0);
    const [loadingResults, setLoadingResults] = useState(true);
    const [resultSearch, setResultSearch] = useState("");
    const [memberSearch, setMemberSearch] = useState("");
    const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== 'team') {
                // Redirect if not a team captain
                if (user.role === 'admin') router.push("/admin/dashboard");
                else if (user.role === 'candidate') router.push("/candidate/dashboard");
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && user.role === 'team') {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Use absolute URL or env var
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            console.log(`[Dashboard] Fetching from: ${API_URL}/api/teams/dashboard`);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/teams/dashboard`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(`[Dashboard] Response status: ${res.status}`);

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Fetch failed: ${res.status} ${res.statusText} - ${errText}`);
            }

            const data = await res.json();
            console.log(`[Dashboard] Received data. Candidates:`, data.candidates);

            setCandidates(data.candidates || []);
            setTeamStrength(data.candidates.length);
            setResults(data.results);
            setMedalCounts(data.medalCounts);
            setTotalPoints(data.team.total_points || 0);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
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
        if (!position) return "bg-muted text-muted-foreground";
        const styles = {
            1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            2: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            3: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        };
        return styles[position as keyof typeof styles] || "bg-muted text-muted-foreground";
    };

    const getGradeBadge = (grade: string) => {
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
                        <h1 className="text-3xl font-bold mb-2">Team Captain Dashboard</h1>
                        <p className="text-muted-foreground">Manage and monitor your team's performance</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Appeals Hidden Temporarily
                        <Button variant="outline" onClick={() => router.push("/captain/appeals")}>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-8 border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Trophy className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Team Code</p>
                                <p className="text-4xl font-bold mt-1 text-primary">{user.team_code || user.name}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-2 border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-lg">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                                <Users className="h-8 w-8 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Team Strength</p>
                                <p className="text-4xl font-bold mt-1 text-secondary">{teamStrength}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-2 border-accent/20 hover:border-accent/50 transition-all hover:shadow-lg">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                                <Award className="h-8 w-8 text-accent" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Medal Summary</p>
                                <div className="flex justify-center gap-6">
                                    <div className="flex flex-col items-center">
                                        <Trophy className="h-6 w-6 text-yellow-500 mb-1" />
                                        <span className="font-bold text-xl">{medalCounts.first}</span>
                                        <span className="text-xs text-muted-foreground">Gold</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Trophy className="h-6 w-6 text-gray-400 mb-1" />
                                        <span className="font-bold text-xl">{medalCounts.second}</span>
                                        <span className="text-xs text-muted-foreground">Silver</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Trophy className="h-6 w-6 text-amber-600 mb-1" />
                                        <span className="font-bold text-xl">{medalCounts.third}</span>
                                        <span className="text-xs text-muted-foreground">Bronze</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-xl font-semibold">Team Results</h2>
                        <div className="w-full sm:w-64">
                            <Input
                                placeholder="Search results..."
                                value={resultSearch}
                                onChange={(e) => setResultSearch(e.target.value)}
                            />
                        </div>
                    </div>

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
                                        <th className="text-left py-3 px-4 whitespace-nowrap">Event Type</th>
                                        <th className="text-left py-3 px-4 whitespace-nowrap">Participant</th>
                                        <th className="text-left py-3 px-4 whitespace-nowrap">Position</th>
                                        <th className="text-left py-3 px-4 whitespace-nowrap">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results
                                        .filter(result =>
                                            result.event_name.toLowerCase().includes(resultSearch.toLowerCase()) ||
                                            (result.candidate_name && result.candidate_name.toLowerCase().includes(resultSearch.toLowerCase())) ||
                                            (result.chest_no && result.chest_no.includes(resultSearch))
                                        )
                                        .map((result) => (
                                            <tr key={result.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                                <td className="py-4 px-4 font-medium min-w-[150px]">{result.event_name}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <Badge variant="outline">{result.event_type}</Badge>
                                                </td>
                                                <td className="py-4 px-4 min-w-[200px]">
                                                    {result.item_type === "Individual" && result.candidate_name ? (
                                                        <div>
                                                            <p className="font-medium">{result.candidate_name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Chest #{result.chest_no}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">Team Event</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    {(result as any).status === 'Absent' ? (
                                                        <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50">Absent</Badge>
                                                    ) : (
                                                        <Badge className={getPositionBadge(result.position)}>
                                                            {result.position === 1 ? '1st' : result.position === 2 ? '2nd' : '3rd'}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    {(result as any).status === 'Absent' ? (
                                                        <span className="text-muted-foreground">-</span>
                                                    ) : (
                                                        <Badge className={getGradeBadge(result.grade)}>
                                                            Grade {result.grade}
                                                        </Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <Card className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-xl font-semibold">Team Members</h2>
                        <div className="w-full sm:w-64">
                            <Input
                                placeholder="Search members..."
                                value={memberSearch}
                                onChange={(e) => setMemberSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidates
                            .filter(candidate =>
                                candidate.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                                candidate.chest_no.includes(memberSearch)
                            )
                            .map((candidate) => (
                                <div
                                    key={candidate.id}
                                    className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-bold text-primary">{candidate.chest_no}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{candidate.name}</p>
                                            <p className="text-sm text-muted-foreground">{candidate.role || 'Participant'}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {formatCategory(candidate.category)}
                                    </Badge>
                                </div>
                            ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CaptainDashboard;
