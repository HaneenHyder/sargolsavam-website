'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Medal, Award, ShieldCheck, Users } from "lucide-react";
import { formatCategory, getCategoryColor } from "@/lib/utils";

interface Result {
    id: string;
    position: string;
    grade: string;
    points: number;
    team_code: string;
    candidate_id: string | null;
    event_id: string;
    event_name: string;
    event_type: string;
    category: string | null;
    item_type: string | null;
    candidate_name: string | null;
    chest_no: string | null;
    team_name: string | null;
}

interface GroupedResults {
    [eventId: string]: {
        eventName: string;
        eventType: string;
        category: string | null;
        itemType: string | null;
        results: Result[];
    };
}

const Results = () => {
    const [groupedResults, setGroupedResults] = useState<GroupedResults>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/results`);
            if (!res.ok) throw new Error('Failed to fetch results');
            const data: Result[] = await res.json();

            // Filter only declared events (assuming backend returns all, or we filter here)
            // The backend query returns all results where position/grade is not null. 
            // We should also check event_status if available, but the query joins events.
            // Let's assume we only want to show results for declared events.
            const declaredResults = data.filter((r: any) => r.event_status === 'Declared');

            const grouped: GroupedResults = {};
            declaredResults.forEach((result) => {
                const eventId = result.event_id;
                if (!grouped[eventId]) {
                    grouped[eventId] = {
                        eventName: result.event_name,
                        eventType: result.event_type,
                        category: result.category,
                        itemType: result.item_type,
                        results: [],
                    };
                }
                grouped[eventId].results.push(result);
            });

            setGroupedResults(grouped);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPositionIcon = (position: string) => {
        if (position === "1st" || position === "1") return <Trophy className="h-5 w-5 text-yellow-500" />;
        if (position === "2nd" || position === "2") return <Medal className="h-5 w-5 text-gray-400" />;
        return <Award className="h-5 w-5 text-amber-600" />;
    };

    const getGradeBadge = (grade: string) => {
        const colors = {
            A: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            B: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            C: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            D: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        };
        return colors[grade as keyof typeof colors] || "bg-muted text-muted-foreground";
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-primary font-achiko tracking-wide">
                        Event Results
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Official results published by the Sargolsavam Committee
                    </p>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                </div>

                {loading ? (
                    <p className="text-center text-muted-foreground py-8">Loading results...</p>
                ) : Object.keys(groupedResults).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No results published yet</p>
                ) : (
                    <div className="space-y-8 max-w-5xl mx-auto">
                        {Object.values(groupedResults).map((event, idx) => (
                            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <h2 className="text-2xl font-bold">{event.eventName}</h2>
                                    <Badge variant="outline">{event.eventType}</Badge>
                                    {event.category && (
                                        <Badge className={`flex items-center gap-1.5 ${getCategoryColor(event.category)} hover:${getCategoryColor(event.category)}`}>
                                            <Users size={12} />
                                            {formatCategory(event.category)}
                                        </Badge>
                                    )}
                                    {event.itemType && (
                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                            {event.itemType}
                                        </Badge>
                                    )}
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left py-3 px-4">Position</th>
                                                <th className="text-left py-3 px-4">
                                                    {event.itemType === "Individual" ? "Candidate" : "Team"}
                                                </th>
                                                {event.itemType === "Individual" && (
                                                    <th className="text-left py-3 px-4">Chest No</th>
                                                )}
                                                <th className="text-left py-3 px-4">Team Code</th>
                                                <th className="text-left py-3 px-4">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {event.results.map((result) => (
                                                <tr key={result.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {getPositionIcon(result.position)}
                                                            <span className="font-semibold">{result.position}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 font-medium">
                                                        {event.itemType === "Individual" && result.candidate_name
                                                            ? result.candidate_name
                                                            : `Team ${result.team_code}`}
                                                    </td>
                                                    {event.itemType === "Individual" && (
                                                        <td className="py-4 px-4 text-muted-foreground">
                                                            {result.chest_no || "-"}
                                                        </td>
                                                    )}
                                                    <td className="py-4 px-4">
                                                        <Badge variant="outline">{result.team_code}</Badge>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Badge className={getGradeBadge(result.grade)}>
                                                            Grade {result.grade}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Trust Indicator Footer */}
            {!loading && Object.keys(groupedResults).length > 0 && (
                <div className="py-8 text-center text-gray-500 border-t mt-12">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <ShieldCheck size={18} className="text-green-600" />
                        <span className="font-medium text-gray-700">Official Verification</span>
                    </div>
                    <p className="text-sm">Results are final and approved by the jury.</p>
                    <p className="text-xs text-gray-400 mt-1">All results are prepared based on jury evaluation and verified by the official results committee.</p>
                </div>
            )}
        </div>
    );
};

export default Results;
