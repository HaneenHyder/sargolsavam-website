'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { Trophy, TrendingUp, Users, Award, Search, Download, ArrowUpDown, ChevronRight, FileDown } from "lucide-react";
import { toast } from "sonner";
import { formatCategory } from "@/lib/utils";

// --- Types ---

interface Result {
    id: number;
    event_id: string; // UUID
    team_code: string;
    candidate_id: string | null; // UUID
    position: number | null;
    grade: string | null;
    points: number;
    status: string;
    event_name: string;
    item_type: string;
    event_type: string; // "Onstage" | "Offstage"
    candidate_name: string | null;
    chest_no: string | null;
    team_name: string | null;
}

interface AnalyticsData {
    id: string;
    chest_no: string;
    name: string;
    team_code: string;
    category: string;
    event_count: string; // Postgres returns count as string
}

interface Candidate {
    id: string; // UUID
    chest_no: string;
    name: string;
    team_code: string;
    category: string;
}

interface Team {
    id: number;
    code: string;
    name: string;
}

// --- Participation Analytics Component ---

function ParticipationAnalyticsView({ analyticsData }: { analyticsData: AnalyticsData[] }) {
    const [zeroEventCandidates, setZeroEventCandidates] = useState<AnalyticsData[]>([]);
    const [teamStats, setTeamStats] = useState<{ team: string; total: number; active: number; percentage: number }[]>([]);
    const [categoryStats, setCategoryStats] = useState<{ category: string; total: number; active: number; percentage: number }[]>([]);
    const [overallStats, setOverallStats] = useState({ total: 0, active: 0, percentage: 0 });

    useEffect(() => {
        if (!analyticsData.length) return;

        // Zero Event Candidates
        const zeroEvents = analyticsData.filter(d => parseInt(d.event_count) === 0);
        setZeroEventCandidates(zeroEvents);

        // Overall Stats
        const totalCandidates = analyticsData.length;
        const activeCandidates = analyticsData.filter(d => parseInt(d.event_count) > 0).length;
        setOverallStats({
            total: totalCandidates,
            active: activeCandidates,
            percentage: totalCandidates > 0 ? (activeCandidates / totalCandidates) * 100 : 0
        });

        // Team Stats
        const teamMap = new Map<string, { total: number; active: number }>();
        analyticsData.forEach(d => {
            if (!teamMap.has(d.team_code)) teamMap.set(d.team_code, { total: 0, active: 0 });
            const team = teamMap.get(d.team_code)!;
            team.total++;
            if (parseInt(d.event_count) > 0) team.active++;
        });

        const tStats = Array.from(teamMap.entries()).map(([team, stats]) => ({
            team,
            total: stats.total,
            active: stats.active,
            percentage: stats.total > 0 ? (stats.active / stats.total) * 100 : 0
        })).sort((a, b) => b.percentage - a.percentage);
        setTeamStats(tStats);

        // Category Stats
        const catMap = new Map<string, { total: number; active: number }>();
        analyticsData.forEach(d => {
            if (!catMap.has(d.category)) catMap.set(d.category, { total: 0, active: 0 });
            const cat = catMap.get(d.category)!;
            cat.total++;
            if (parseInt(d.event_count) > 0) cat.active++;
        });

        const cStats = Array.from(catMap.entries()).map(([category, stats]) => ({
            category,
            total: stats.total,
            active: stats.active,
            percentage: stats.total > 0 ? (stats.active / stats.total) * 100 : 0
        })).sort((a, b) => b.percentage - a.percentage);
        setCategoryStats(cStats);

    }, [analyticsData]);

    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Unable to open print window. Please allow popups.");
            return;
        }

        const currentDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Participation Analytics Report - Sargolsavam</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        padding: 40px; 
                        background: #fff;
                        color: #1a1a1a;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        border-bottom: 3px solid #2563eb;
                        padding-bottom: 20px;
                    }
                    .header h1 { 
                        color: #1e40af; 
                        font-size: 28px; 
                        margin-bottom: 5px;
                    }
                    .header p { 
                        color: #64748b; 
                        font-size: 14px; 
                    }
                    .summary-cards {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        margin: 25px 0;
                    }
                    .summary-card {
                        text-align: center;
                        padding: 20px 30px;
                        background: #f8fafc;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                    }
                    .summary-card.highlight { background: #dcfce7; }
                    .summary-card.warning { background: #fef3c7; }
                    .summary-card.danger { background: #fee2e2; }
                    .summary-card h3 {
                        font-size: 12px;
                        color: #64748b;
                        margin-bottom: 8px;
                    }
                    .summary-card .value {
                        font-size: 32px;
                        font-weight: bold;
                        color: #1e40af;
                    }
                    .summary-card.highlight .value { color: #16a34a; }
                    .summary-card.danger .value { color: #dc2626; }
                    .section { margin-top: 30px; }
                    .section h2 {
                        font-size: 18px;
                        color: #1e40af;
                        margin-bottom: 15px;
                        padding-bottom: 8px;
                        border-bottom: 2px solid #e2e8f0;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        font-size: 12px;
                    }
                    th { 
                        background: #1e40af; 
                        color: white; 
                        padding: 10px 8px; 
                        text-align: left;
                        font-weight: 600;
                    }
                    th.right, td.right { text-align: right; }
                    td { 
                        padding: 8px; 
                        border-bottom: 1px solid #e2e8f0;
                    }
                    tr:nth-child(even) { background: #f8fafc; }
                    .progress-bar {
                        width: 100px;
                        height: 8px;
                        background: #e2e8f0;
                        border-radius: 4px;
                        overflow: hidden;
                        display: inline-block;
                    }
                    .progress-fill { height: 100%; border-radius: 4px; }
                    .progress-high { background: #16a34a; }
                    .progress-medium { background: #eab308; }
                    .progress-low { background: #dc2626; }
                    .footer { 
                        margin-top: 30px; 
                        text-align: center; 
                        font-size: 11px; 
                        color: #94a3b8;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 15px;
                    }
                    @media print {
                        body { padding: 20px; }
                        .page-break { page-break-before: always; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Participation Analytics Report</h1>
                    <p>Sargolsavam - Generated on ${currentDate}</p>
                </div>

                <div class="summary-cards">
                    <div class="summary-card highlight">
                        <h3>Overall Participation</h3>
                        <div class="value">${overallStats.percentage.toFixed(1)}%</div>
                        <p style="font-size: 11px; color: #64748b; margin-top: 5px;">${overallStats.active} of ${overallStats.total} candidates</p>
                    </div>
                    <div class="summary-card danger">
                        <h3>Zero Participation</h3>
                        <div class="value">${zeroEventCandidates.length}</div>
                        <p style="font-size: 11px; color: #64748b; margin-top: 5px;">Candidates not participating</p>
                    </div>
                    ${teamStats.length > 0 ? `
                    <div class="summary-card warning">
                        <h3>Top Team</h3>
                        <div class="value">${teamStats[0].percentage.toFixed(1)}%</div>
                        <p style="font-size: 11px; color: #64748b; margin-top: 5px;">${teamStats[0].team}</p>
                    </div>
                    ` : ''}
                </div>

                <div class="section">
                    <h2>Team Participation Breakdown</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th class="right">Total Members</th>
                                <th class="right">Active</th>
                                <th class="right">Participation %</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teamStats.map(stat => `
                                <tr>
                                    <td><strong>${stat.team}</strong></td>
                                    <td class="right">${stat.total}</td>
                                    <td class="right">${stat.active}</td>
                                    <td class="right"><strong>${stat.percentage.toFixed(1)}%</strong></td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill ${stat.percentage >= 80 ? 'progress-high' : stat.percentage >= 50 ? 'progress-medium' : 'progress-low'}" style="width: ${stat.percentage}%"></div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="section">
                    <h2>Category Participation Breakdown</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th class="right">Total Candidates</th>
                                <th class="right">Active</th>
                                <th class="right">Participation %</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${categoryStats.map(stat => `
                                <tr>
                                    <td><strong>${formatCategory(stat.category)}</strong></td>
                                    <td class="right">${stat.total}</td>
                                    <td class="right">${stat.active}</td>
                                    <td class="right"><strong>${stat.percentage.toFixed(1)}%</strong></td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill ${stat.percentage >= 80 ? 'progress-high' : stat.percentage >= 50 ? 'progress-medium' : 'progress-low'}" style="width: ${stat.percentage}%"></div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                ${zeroEventCandidates.length > 0 ? `
                <div class="section page-break">
                    <h2 style="color: #dc2626;">Candidates with Zero Participation (${zeroEventCandidates.length})</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Chest No</th>
                                <th>Name</th>
                                <th>Team</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${zeroEventCandidates.map(c => `
                                <tr>
                                    <td><strong>${c.chest_no}</strong></td>
                                    <td>${c.name}</td>
                                    <td>${c.team_code}</td>
                                    <td>${formatCategory(c.category)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}

                <div class="footer">
                    <p>This report was automatically generated from the Sargolsavam Admin Panel</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 250);

        toast.success("PDF export ready - use 'Save as PDF' in print dialog");
    };

    return (
        <div className="space-y-6">
            {/* Header with Export Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Participation Analytics</h2>
                <Button variant="outline" size="sm" onClick={exportToPDF}>
                    <FileDown className="h-4 w-4 mr-2" /> Export PDF
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Overall Participation</h3>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">{overallStats.percentage.toFixed(1)}%</span>
                        <span className="text-sm text-gray-500">of candidates</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {overallStats.active} active out of {overallStats.total} total
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Candidates with 0 Events</h3>
                    <div className="mt-4">
                        <span className="text-4xl font-bold text-red-500">{zeroEventCandidates.length}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Students registered but not participating
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Top Team Participation</h3>
                    <div className="mt-4">
                        {teamStats.length > 0 && (
                            <>
                                <span className="text-4xl font-bold text-green-600">{teamStats[0].percentage.toFixed(1)}%</span>
                                <span className="ml-2 text-lg font-medium text-gray-700">{teamStats[0].team}</span>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            {/* Team Analysis */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Team Participation Breakdown</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Team</TableHead>
                                <TableHead className="text-right">Total Members</TableHead>
                                <TableHead className="text-right">Active</TableHead>
                                <TableHead className="text-right">Participation %</TableHead>
                                <TableHead className="w-[200px]">Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamStats.map((stat, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{stat.team}</TableCell>
                                    <TableCell className="text-right">{stat.total}</TableCell>
                                    <TableCell className="text-right">{stat.active}</TableCell>
                                    <TableCell className="text-right font-bold">{stat.percentage.toFixed(1)}%</TableCell>
                                    <TableCell>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${stat.percentage >= 80 ? 'bg-green-500' : stat.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${stat.percentage}%` }}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Category Analysis */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Category Participation Breakdown</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Total candidates</TableHead>
                                <TableHead className="text-right">Active</TableHead>
                                <TableHead className="text-right">Participation %</TableHead>
                                <TableHead className="w-[200px]">Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categoryStats.map((stat, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{formatCategory(stat.category)}</TableCell>
                                    <TableCell className="text-right">{stat.total}</TableCell>
                                    <TableCell className="text-right">{stat.active}</TableCell>
                                    <TableCell className="text-right font-bold">{stat.percentage.toFixed(1)}%</TableCell>
                                    <TableCell>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${stat.percentage >= 80 ? 'bg-blue-500' : stat.percentage >= 50 ? 'bg-indigo-500' : 'bg-purple-500'}`}
                                                style={{ width: `${stat.percentage}%` }}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Zero Events List */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Candidates with Zero Participation</h3>
                <div className="max-h-[400px] overflow-y-auto border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Chest No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Category</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {zeroEventCandidates.length > 0 ? zeroEventCandidates.map((c, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-mono">{c.chest_no}</TableCell>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell><Badge variant="outline">{c.team_code}</Badge></TableCell>
                                    <TableCell>{formatCategory(c.category)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-green-600 font-medium">
                                        Amazing! Every registered candidate has participated in at least one event.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}

// --- Combined Analytics Component ---

interface TopCandidate {
    name: string;
    chest_number: string;
    team_code: string;
    points: number;
}

interface EventStats {
    event_name: string;
    participants: number;
    total_points_awarded: number;
}

interface CategoryStats {
    category: string;
    onstage_points: number;
    offstage_points: number;
}

function CombinedAnalyticsView({ results, candidates }: { results: Result[], candidates: Candidate[] }) {
    const [topCandidatesByCategory, setTopCandidatesByCategory] = useState<{ category: string; candidates: TopCandidate[] }[]>([]);
    const [mostParticipatedEvents, setMostParticipatedEvents] = useState<EventStats[]>([]);
    const [highestPointEvents, setHighestPointEvents] = useState<EventStats[]>([]);
    const [categoryPerformance, setCategoryPerformance] = useState<CategoryStats[]>([]);

    useEffect(() => {
        processAnalytics();
    }, [results]);

    const processAnalytics = () => {
        // Top Candidates by Category
        const candidatePointsMap = new Map<string, TopCandidate & { category: string }>();

        // Create a map of candidate ID to category for quick lookup
        const candidateCategoryMap = new Map<string, string>();
        candidates.forEach(c => candidateCategoryMap.set(String(c.id), c.category));

        results.forEach(result => {
            if (result.candidate_id && result.candidate_name) {
                const key = String(result.candidate_id);
                if (!candidatePointsMap.has(key)) {
                    candidatePointsMap.set(key, {
                        name: result.candidate_name,
                        chest_number: result.chest_no || '',
                        team_code: result.team_code,
                        points: 0,
                        category: formatCategory(candidateCategoryMap.get(key) || 'Unknown')
                    });
                }
                candidatePointsMap.get(key)!.points += result.points;
            }
        });

        // Group by category
        const categoryGroups = new Map<string, TopCandidate[]>();
        // Initialize with required categories to ensure sections always exist
        ["Senior", "Junior", "Sub Junior"].forEach(cat => categoryGroups.set(cat, []));

        candidatePointsMap.forEach((candidate) => {
            // Skip Unknown category
            if (candidate.category === 'Unknown' || !candidate.category) return;

            if (!categoryGroups.has(candidate.category)) {
                // If we encounter a category not in our default list, add it
                categoryGroups.set(candidate.category, []);
            }
            categoryGroups.get(candidate.category)!.push(candidate);
        });

        // Sort and slice top 3 for each category
        // We want to preserve the order: Senior, Junior, Sub Junior, then others
        const orderedCategories = ["Senior", "Junior", "Sub Junior"];
        const processedCategories = Array.from(categoryGroups.entries())
            .map(([category, candidates]) => ({
                category,
                candidates: candidates.sort((a, b) => b.points - a.points).slice(0, 3)
            }))
            .sort((a, b) => {
                const indexA = orderedCategories.indexOf(a.category);
                const indexB = orderedCategories.indexOf(b.category);

                // If both are in the ordered list, sort by index
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                // If only A is in the list, A comes first
                if (indexA !== -1) return -1;
                // If only B is in the list, B comes first
                if (indexB !== -1) return 1;
                // Otherwise sort alphabetically
                return a.category.localeCompare(b.category);
            });

        setTopCandidatesByCategory(processedCategories);

        // Event Stats
        const eventStatsMap = new Map<string, EventStats>();
        results.forEach(result => {
            const key = String(result.event_id);
            if (!eventStatsMap.has(key)) {
                eventStatsMap.set(key, {
                    event_name: result.event_name,
                    participants: 0,
                    total_points_awarded: 0
                });
            }
            const stats = eventStatsMap.get(key)!;
            stats.participants += 1;
            stats.total_points_awarded += result.points;
        });
        const eventStats = Array.from(eventStatsMap.values());
        setMostParticipatedEvents([...eventStats].sort((a, b) => b.participants - a.participants).slice(0, 5));
        setHighestPointEvents([...eventStats].sort((a, b) => b.total_points_awarded - a.total_points_awarded).slice(0, 5));

        // Category Performance
        const teamCategoryMap = new Map<string, { onstage: number; offstage: number }>();
        results.forEach(result => {
            if (!teamCategoryMap.has(result.team_code)) {
                teamCategoryMap.set(result.team_code, { onstage: 0, offstage: 0 });
            }
            const stats = teamCategoryMap.get(result.team_code)!;
            if (result.event_type === "Onstage") {
                stats.onstage += result.points;
            } else {
                stats.offstage += result.points;
            }
        });
        setCategoryPerformance(Array.from(teamCategoryMap.entries())
            .map(([team, stats]) => ({
                category: team,
                onstage_points: stats.onstage,
                offstage_points: stats.offstage
            }))
            .sort((a, b) => (b.onstage_points + b.offstage_points) - (a.onstage_points + a.offstage_points))
            .slice(0, 5));
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                {topCandidatesByCategory.map((catGroup, catIdx) => (
                    <Card key={catIdx} className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Top Candidates - {catGroup.category}</h3>
                        </div>
                        <div className="space-y-3">
                            {catGroup.candidates.map((candidate, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? "bg-yellow-100 text-yellow-800" :
                                            idx === 1 ? "bg-gray-100 text-gray-800" :
                                                idx === 2 ? "bg-amber-100 text-amber-800" :
                                                    "bg-muted text-muted-foreground"
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{candidate.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{candidate.chest_number}</span>
                                                <span>•</span>
                                                <Badge variant="outline" className="text-[10px] px-1 py-0">{candidate.team_code}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">{candidate.points}</p>
                                        <p className="text-[10px] text-muted-foreground">pts</p>
                                    </div>
                                </div>
                            ))}
                            {catGroup.candidates.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No candidates yet</p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-secondary" />
                        <h3 className="text-lg font-semibold">Most Participated Events</h3>
                    </div>
                    <div className="space-y-3">
                        {mostParticipatedEvents.map((event, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{event.event_name}</p>
                                    <p className="text-xs text-muted-foreground">{event.participants} participants</p>
                                </div>
                                <Badge variant="secondary">{event.participants}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="h-5 w-5 text-accent" />
                        <h3 className="text-lg font-semibold">Events with Maximum Points</h3>
                    </div>
                    <div className="space-y-3">
                        {highestPointEvents.map((event, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{event.event_name}</p>
                                    <p className="text-xs text-muted-foreground">{event.total_points_awarded} points awarded</p>
                                </div>
                                <Badge>{event.total_points_awarded}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Top Teams: Onstage vs Offstage Performance</h3>
                </div>
                <div className="space-y-3">
                    {categoryPerformance.map((cat, idx) => (
                        <div key={idx} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold">{cat.category}</p>
                                <p className="text-sm text-muted-foreground">
                                    Total: {cat.onstage_points + cat.offstage_points} points
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3 bg-primary/5 rounded">
                                    <span className="text-sm">Onstage</span>
                                    <Badge variant="secondary">{cat.onstage_points}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-accent/5 rounded">
                                    <span className="text-sm">Offstage</span>
                                    <Badge variant="outline">{cat.offstage_points}</Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

// --- Candidate Performance Component ---

interface CandidatePerformance {
    chest_number: string;
    name: string;
    team_code: string;
    division: string;
    total_points: number;
    events_participated: number;
    first_prizes: number;
    second_prizes: number;
    third_prizes: number;
    event_results: Array<{
        event_name: string;
        position: string;
        points: number;
        grade: string;
    }>;
}

function CandidatePerformanceTable({ results, candidates, detailedData }: { results: Result[], candidates: Candidate[], detailedData?: any[] }) {
    const [players, setPlayers] = useState<CandidatePerformance[]>([]);
    const [filteredPlayers, setFilteredPlayers] = useState<CandidatePerformance[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [teamFilter, setTeamFilter] = useState("all");
    const [divisionFilter, setDivisionFilter] = useState("all");
    const [prizeFilter, setPrizeFilter] = useState("all");
    const [sortBy, setSortBy] = useState<"points" | "name" | "events">("points");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        if (detailedData && detailedData.length > 0) {
            // Use server-side aggregated data
            setPlayers(detailedData.map(d => ({
                chest_number: d.chest_no,
                name: d.name,
                team_code: d.team_code,
                division: d.division,
                total_points: parseInt(d.total_points),
                events_participated: parseInt(d.events_participated),
                first_prizes: parseInt(d.first_prizes),
                second_prizes: parseInt(d.second_prizes),
                third_prizes: parseInt(d.third_prizes),
                event_results: d.event_results || []
            })));
        } else {
            // Fallback to client-side aggregation
            processPlayers();
        }
    }, [results, candidates, detailedData]);

    useEffect(() => {
        applyFilters();
    }, [players, searchQuery, teamFilter, divisionFilter, prizeFilter, sortBy, sortOrder]);

    const processPlayers = () => {
        const playerMap = new Map<string, CandidatePerformance>();

        candidates.forEach(candidate => {
            playerMap.set(String(candidate.id), {
                chest_number: candidate.chest_no,
                name: candidate.name,
                team_code: candidate.team_code,
                division: candidate.category,
                total_points: 0,
                events_participated: 0,
                first_prizes: 0,
                second_prizes: 0,
                third_prizes: 0,
                event_results: []
            });
        });

        console.log("Process Players Debug:", {
            candidatesCount: candidates.length,
            mapSize: playerMap.size,
            resultsCount: results.length,
            sampleCandidateId: candidates[0]?.id,
            sampleResultCandidateId: results[0]?.candidate_id
        });

        let matchCount = 0;
        results.forEach(result => {
            if (result.candidate_id && playerMap.has(String(result.candidate_id))) {
                matchCount++;
                const player = playerMap.get(String(result.candidate_id))!;
                player.total_points += result.points;
                player.events_participated += 1;

                if (result.position === 1) player.first_prizes += 1;
                if (result.position === 2) player.second_prizes += 1;
                if (result.position === 3) player.third_prizes += 1;

                player.event_results.push({
                    event_name: result.event_name,
                    position: result.position ? (result.position === 1 ? '1st' : result.position === 2 ? '2nd' : result.position === 3 ? '3rd' : String(result.position)) : '-',
                    points: result.points,
                    grade: result.grade || '-'
                });
            }
        });

        console.log("Matches found:", matchCount);

        setPlayers(Array.from(playerMap.values()));
    };

    const applyFilters = () => {
        let filtered = [...players];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.chest_number.includes(query));
        }
        if (teamFilter !== "all") filtered = filtered.filter(p => p.team_code === teamFilter);
        if (divisionFilter !== "all") filtered = filtered.filter(p => p.division === divisionFilter);
        if (prizeFilter !== "all") {
            if (prizeFilter === "1st") filtered = filtered.filter(p => p.first_prizes > 0);
            if (prizeFilter === "2nd") filtered = filtered.filter(p => p.second_prizes > 0);
            if (prizeFilter === "3rd") filtered = filtered.filter(p => p.third_prizes > 0);
        }

        filtered.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "points") comparison = a.total_points - b.total_points;
            else if (sortBy === "name") comparison = a.name.localeCompare(b.name);
            else if (sortBy === "events") comparison = a.events_participated - b.events_participated;
            return sortOrder === "asc" ? comparison : -comparison;
        });

        setFilteredPlayers(filtered);
    };

    const exportToCSV = () => {
        const headers = ["Chest Number", "Name", "Team", "Division", "Events Participated", "1st Prizes", "2nd Prizes", "3rd Prizes", "Total Points"];
        const rows = filteredPlayers.map(p => [p.chest_number, p.name, p.team_code, p.division, p.events_participated, p.first_prizes, p.second_prizes, p.third_prizes, p.total_points]);
        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `player-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success("Data exported successfully");
    };

    const uniqueTeams = Array.from(new Set(players.map(p => p.team_code))).sort();
    const uniqueDivisions = Array.from(new Set(players.map(p => p.division))).sort();

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div className="grid md:grid-cols-5 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={teamFilter} onValueChange={setTeamFilter}>
                        <SelectTrigger><SelectValue placeholder="Filter by Team" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Teams</SelectItem>
                            {uniqueTeams.map(team => <SelectItem key={team} value={team}>{team}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                        <SelectTrigger><SelectValue placeholder="Filter by Division" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Divisions</SelectItem>
                            {uniqueDivisions.filter(Boolean).map((div, idx) => <SelectItem key={`${div}-${idx}`} value={div}>{div}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={prizeFilter} onValueChange={setPrizeFilter}>
                        <SelectTrigger><SelectValue placeholder="Filter by Prize" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Prizes</SelectItem>
                            <SelectItem value="1st">1st Prize Winners</SelectItem>
                            <SelectItem value="2nd">2nd Prize Winners</SelectItem>
                            <SelectItem value="3rd">3rd Prize Winners</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={exportToCSV} variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
                </div>

                <div className="flex gap-2">
                    <Button variant={sortBy === "points" ? "primary" : "outline"} size="sm" onClick={() => { if (sortBy === "points") setSortOrder(sortOrder === "asc" ? "desc" : "asc"); else setSortBy("points"); }}>Points <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                    <Button variant={sortBy === "name" ? "primary" : "outline"} size="sm" onClick={() => { if (sortBy === "name") setSortOrder(sortOrder === "asc" ? "desc" : "asc"); else setSortBy("name"); }}>Name <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                    <Button variant={sortBy === "events" ? "primary" : "outline"} size="sm" onClick={() => { if (sortBy === "events") setSortOrder(sortOrder === "asc" ? "desc" : "asc"); else setSortBy("events"); }}>Events <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                </div>

                <p className="text-sm text-muted-foreground">Showing {filteredPlayers.length} of {players.length} players</p>

                <div className="border rounded-lg overflow-auto max-h-[600px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Chest #</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Division</TableHead>
                                <TableHead className="text-center">Events</TableHead>
                                <TableHead className="text-center">🥇</TableHead>
                                <TableHead className="text-center">🥈</TableHead>
                                <TableHead className="text-center">🥉</TableHead>
                                <TableHead className="text-right">Total Points</TableHead>
                                <TableHead>Event Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPlayers.length === 0 ? (
                                <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">No players found</TableCell></TableRow>
                            ) : (
                                filteredPlayers.map((player, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{player.chest_number}</TableCell>
                                        <TableCell>{player.name}</TableCell>
                                        <TableCell><Badge variant="outline">{player.team_code}</Badge></TableCell>
                                        <TableCell><Badge variant="secondary">{player.division}</Badge></TableCell>
                                        <TableCell className="text-center">{player.events_participated}</TableCell>
                                        <TableCell className="text-center">{player.first_prizes}</TableCell>
                                        <TableCell className="text-center">{player.second_prizes}</TableCell>
                                        <TableCell className="text-center">{player.third_prizes}</TableCell>
                                        <TableCell className="text-right font-bold">{player.total_points}</TableCell>
                                        <TableCell>
                                            <div className="space-y-1 max-w-xs">
                                                {player.event_results.map((result, idx) => (
                                                    <div key={idx} className="text-xs flex items-center gap-2">
                                                        <span className="truncate">{result.event_name}</span>
                                                        <Badge variant="outline" className="text-xs">{result.position}</Badge>
                                                        <span className="text-muted-foreground">{result.points}pts</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Card>
    );
}

// --- Team Performance Component ---

interface TeamPerformance {
    team_code: string;
    team_name: string;
    total_points: number;
    first_prizes: number;
    second_prizes: number;
    third_prizes: number;
    total_events: number;
    onstage_points: number;
    offstage_points: number;
    best_performer: { name: string; points: number; } | null;
    candidates: Array<{ name: string; chest_number: string; points: number; events: number; }>;
    group_events: Result[];
}

function TeamPerformanceTable({ results, teams }: { results: Result[], teams: Team[] }) {
    const [teamStats, setTeamStats] = useState<TeamPerformance[]>([]);
    const [filteredTeams, setFilteredTeams] = useState<TeamPerformance[]>([]);
    const [sortBy, setSortBy] = useState<"points" | "prizes" | "events">("points");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedTeam, setSelectedTeam] = useState<TeamPerformance | null>(null);

    useEffect(() => {
        processTeams();
    }, [results, teams]);

    useEffect(() => {
        applySorting();
    }, [teamStats, sortBy, sortOrder]);

    const processTeams = () => {
        const teamMap = new Map<string, TeamPerformance>();

        teams.forEach(team => {
            teamMap.set(team.code, {
                team_code: team.code,
                team_name: team.name,
                total_points: 0,
                first_prizes: 0,
                second_prizes: 0,
                third_prizes: 0,
                total_events: 0,
                onstage_points: 0,
                offstage_points: 0,
                best_performer: null,
                candidates: [],
                group_events: []
            });
        });

        const candidatePointsMap = new Map<string, { name: string; chest_number: string; points: number; events: number; team_code: string }>();

        results.forEach(result => {
            if (!teamMap.has(result.team_code)) {
                // Should not happen if teams are synced, but handle just in case
                teamMap.set(result.team_code, {
                    team_code: result.team_code,
                    team_name: result.team_name || result.team_code,
                    total_points: 0,
                    first_prizes: 0,
                    second_prizes: 0,
                    third_prizes: 0,
                    total_events: 0,
                    onstage_points: 0,
                    offstage_points: 0,
                    best_performer: null,
                    candidates: [],
                    group_events: []
                });
            }

            const team = teamMap.get(result.team_code)!;
            team.total_points += result.points;
            team.total_events += 1;

            if (result.position === 1) team.first_prizes += 1;
            if (result.position === 2) team.second_prizes += 1;
            if (result.position === 3) team.third_prizes += 1;

            if (result.event_type === "Onstage") {
                team.onstage_points += result.points;
            } else {
                team.offstage_points += result.points;
            }

            if (result.candidate_id && result.candidate_name) {
                const key = `${result.team_code}-${result.candidate_id}`;
                if (!candidatePointsMap.has(key)) {
                    candidatePointsMap.set(key, {
                        name: result.candidate_name,
                        chest_number: result.chest_no || '',
                        points: 0,
                        events: 0,
                        team_code: result.team_code
                    });
                }
                const candidate = candidatePointsMap.get(key)!;
                candidate.points += result.points;
                candidate.events += 1;
            } else if (result.item_type === 'Group') {
                // Add to group events list
                team.group_events.push(result);
            }
        });

        candidatePointsMap.forEach((candidate) => {
            const team = teamMap.get(candidate.team_code);
            if (team) {
                team.candidates.push({
                    name: candidate.name,
                    chest_number: candidate.chest_number,
                    points: candidate.points,
                    events: candidate.events
                });

                if (!team.best_performer || candidate.points > team.best_performer.points) {
                    team.best_performer = {
                        name: candidate.name,
                        points: candidate.points
                    };
                }
            }
        });

        setTeamStats(Array.from(teamMap.values()));
    };

    const applySorting = () => {
        let sorted = [...teamStats];
        sorted.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "points") comparison = a.total_points - b.total_points;
            else if (sortBy === "prizes") {
                const totalA = a.first_prizes + a.second_prizes + a.third_prizes;
                const totalB = b.first_prizes + b.second_prizes + b.third_prizes;
                comparison = totalA - totalB;
            }
            else if (sortBy === "events") comparison = a.total_events - b.total_events;
            return sortOrder === "asc" ? comparison : -comparison;
        });
        setFilteredTeams(sorted);
    };

    const exportToCSV = () => {
        const headers = ["Team Code", "Team Name", "Total Points", "1st Prizes", "2nd Prizes", "3rd Prizes", "Total Events", "Onstage Points", "Offstage Points", "Best Performer"];
        const rows = filteredTeams.map(t => [t.team_code, t.team_name, t.total_points, t.first_prizes, t.second_prizes, t.third_prizes, t.total_events, t.onstage_points, t.offstage_points, t.best_performer ? `${t.best_performer.name} (${t.best_performer.points} pts)` : "N/A"]);
        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `team-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success("Data exported successfully");
    };

    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Unable to open print window. Please allow popups.");
            return;
        }

        const currentDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Team Performance Report - Sargolsavam</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        padding: 40px; 
                        background: #fff;
                        color: #1a1a1a;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        border-bottom: 3px solid #2563eb;
                        padding-bottom: 20px;
                    }
                    .header h1 { 
                        color: #1e40af; 
                        font-size: 28px; 
                        margin-bottom: 5px;
                    }
                    .header p { 
                        color: #64748b; 
                        font-size: 14px; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px;
                        font-size: 12px;
                    }
                    th { 
                        background: #1e40af; 
                        color: white; 
                        padding: 12px 8px; 
                        text-align: left;
                        font-weight: 600;
                    }
                    th.center, td.center { text-align: center; }
                    th.right, td.right { text-align: right; }
                    td { 
                        padding: 10px 8px; 
                        border-bottom: 1px solid #e2e8f0;
                    }
                    tr:nth-child(even) { background: #f8fafc; }
                    tr:hover { background: #f1f5f9; }
                    .rank { 
                        font-weight: bold; 
                        color: #1e40af;
                    }
                    .team-name { font-weight: 600; }
                    .team-code { 
                        font-size: 10px; 
                        color: #64748b;
                    }
                    .gold { color: #ca8a04; }
                    .silver { color: #64748b; }
                    .bronze { color: #b45309; }
                    .total-points { 
                        font-weight: bold; 
                        font-size: 14px;
                        color: #1e40af;
                    }
                    .footer { 
                        margin-top: 30px; 
                        text-align: center; 
                        font-size: 11px; 
                        color: #94a3b8;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 15px;
                    }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Team Performance Report</h1>
                    <p>Sargolsavam - Generated on ${currentDate}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Team</th>
                            <th class="center">Events</th>
                            <th class="center">🥇 1st</th>
                            <th class="center">🥈 2nd</th>
                            <th class="center">🥉 3rd</th>
                            <th class="center">Onstage</th>
                            <th class="center">Offstage</th>
                            <th class="right">Total Points</th>
                            <th>Best Performer</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredTeams.map((team, idx) => `
                            <tr>
                                <td class="rank">${idx + 1}</td>
                                <td>
                                    <div class="team-name">${team.team_name}</div>
                                    <div class="team-code">${team.team_code}</div>
                                </td>
                                <td class="center">${team.total_events}</td>
                                <td class="center gold">${team.first_prizes}</td>
                                <td class="center silver">${team.second_prizes}</td>
                                <td class="center bronze">${team.third_prizes}</td>
                                <td class="center">${team.onstage_points}</td>
                                <td class="center">${team.offstage_points}</td>
                                <td class="right total-points">${team.total_points}</td>
                                <td>${team.best_performer ? `${team.best_performer.name} (${team.best_performer.points} pts)` : '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <p>This report was automatically generated from the Sargolsavam Admin Panel</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
        }, 250);

        toast.success("PDF export ready - use 'Save as PDF' in print dialog");
    };

    return (
        <>
            <Card className="p-6">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button variant={sortBy === "points" ? "primary" : "outline"} size="sm" onClick={() => { if (sortBy === "points") setSortOrder(sortOrder === "asc" ? "desc" : "asc"); else setSortBy("points"); }}>Total Points <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                            <Button variant={sortBy === "prizes" ? "primary" : "outline"} size="sm" onClick={() => { if (sortBy === "prizes") setSortOrder(sortOrder === "asc" ? "desc" : "asc"); else setSortBy("prizes"); }}>Prizes <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                            <Button variant={sortBy === "events" ? "primary" : "outline"} size="sm" onClick={() => { if (sortBy === "events") setSortOrder(sortOrder === "asc" ? "desc" : "asc"); else setSortBy("events"); }}>Participation <ArrowUpDown className="h-3 w-3 ml-1" /></Button>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={exportToPDF} variant="outline"><FileDown className="h-4 w-4 mr-2" /> Export PDF</Button>
                            <Button onClick={exportToCSV} variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
                        </div>
                    </div>

                    <div className="border rounded-lg overflow-auto max-h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Rank</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead className="text-center">Events</TableHead>
                                    <TableHead className="text-center">🥇</TableHead>
                                    <TableHead className="text-center">🥈</TableHead>
                                    <TableHead className="text-center">🥉</TableHead>
                                    <TableHead className="text-right">Total Points</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTeams.map((team, idx) => (
                                    <TableRow key={team.team_code} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-bold">{idx + 1}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{team.team_name}</div>
                                                <div className="text-xs text-muted-foreground">{team.team_code}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{team.total_events}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-yellow-600">{team.first_prizes}</TableCell>
                                        <TableCell className="text-center font-medium text-gray-500">{team.second_prizes}</TableCell>
                                        <TableCell className="text-center font-medium text-amber-700">{team.third_prizes}</TableCell>
                                        <TableCell className="text-right font-bold text-lg">{team.total_points}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedTeam(team)}><ChevronRight className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>

            <Modal
                isOpen={!!selectedTeam}
                onClose={() => setSelectedTeam(null)}
                title={`${selectedTeam?.team_name || 'Team'} - Detailed Breakdown`}
                className="max-w-3xl"
            >
                <div className="max-h-[70vh] overflow-auto">
                    {selectedTeam && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4">
                                    <p className="text-sm text-muted-foreground">Total Points</p>
                                    <p className="text-3xl font-bold">{selectedTeam.total_points}</p>
                                </Card>
                                <Card className="p-4">
                                    <p className="text-sm text-muted-foreground">Total Events</p>
                                    <p className="text-3xl font-bold">{selectedTeam.total_events}</p>
                                </Card>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3">Team Members Performance</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Chest #</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-center">Events</TableHead>
                                            <TableHead className="text-right">Points</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedTeam.candidates.sort((a, b) => b.points - a.points).map((candidate, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{candidate.chest_number}</TableCell>
                                                <TableCell>{candidate.name}</TableCell>
                                                <TableCell className="text-center">{candidate.events}</TableCell>
                                                <TableCell className="text-right font-medium">{candidate.points}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {selectedTeam.group_events.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3">Group Events Won</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Event Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-center">Position</TableHead>
                                                <TableHead className="text-right">Points</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedTeam.group_events.map((event, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{event.event_name}</TableCell>
                                                    <TableCell><Badge variant="outline">{event.event_type}</Badge></TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={
                                                            event.position === 1 ? "bg-yellow-100 text-yellow-800" :
                                                                event.position === 2 ? "bg-gray-100 text-gray-800" :
                                                                    "bg-amber-100 text-amber-800"
                                                        }>
                                                            {event.position === 1 ? '1st' : event.position === 2 ? '2nd' : '3rd'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">{event.points}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}



// --- Main Page Component ---

export default function LeaderboardPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [detailedStats, setDetailedStats] = useState<any[]>([]);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(); // Initial fetch

        const interval = setInterval(() => {
            fetchData(true); // Background fetch
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchData = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            const token = localStorage.getItem('token');
            const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

            const [resultsRes, candidatesRes, teamsRes, detailedRes, analyticsRes] = await Promise.all([
                fetch(`${API_URL}/api/results`, { headers }).then(res => res.json()),
                fetch(`${API_URL}/api/candidates?all=true`, { headers }).then(res => res.json()),
                fetch(`${API_URL}/api/teams`, { headers }).then(res => res.json()),
                fetch(`${API_URL}/api/admin/leaderboard/detailed`, {
                    headers,
                    credentials: 'include'
                }).then(res => res.json()),
                fetch(`${API_URL}/api/admin/leaderboard/analytics`, { headers }).then(res => res.json())
            ]);

            // Handle new paginated API response structure
            const candidatesData = candidatesRes?.data ? candidatesRes.data : (Array.isArray(candidatesRes) ? candidatesRes : []);

            console.log("Fetch Data Results:", {
                results: Array.isArray(resultsRes) ? resultsRes.length : 'Not Array',
                candidatesRaw: candidatesRes?.data ? `Paginated: ${candidatesRes.data.length} items` : (Array.isArray(candidatesRes) ? `Array: ${candidatesRes.length}` : 'Invalid format'),
                candidatesExtracted: candidatesData.length,
                teams: Array.isArray(teamsRes) ? teamsRes.length : 'Not Array',
                detailed: Array.isArray(detailedRes) ? detailedRes.length : 'Not Array',
                analytics: Array.isArray(analyticsRes) ? analyticsRes.length : 'Not Array'
            });

            const publishedResults = Array.isArray(resultsRes)
                ? resultsRes.filter((r: any) => r.event_status === 'Declared')
                : [];

            setResults(publishedResults);
            setCandidates(candidatesData);
            setTeams(Array.isArray(teamsRes) ? teamsRes : []);

            if (Array.isArray(detailedRes)) {
                setDetailedStats(detailedRes);
            }

            if (Array.isArray(analyticsRes)) {
                setAnalyticsData(analyticsRes);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            if (!isBackground) toast.error("Failed to load leaderboard data");
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center p-8">Loading leaderboard...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Leaderboard & Analytics</h1>
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="teams">Team Performance</TabsTrigger>
                    <TabsTrigger value="candidates">Candidate Performance</TabsTrigger>
                    <TabsTrigger value="analytics">Participation Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <CombinedAnalyticsView results={results} candidates={candidates} />
                </TabsContent>
                <TabsContent value="teams">
                    <TeamPerformanceTable results={results} teams={teams} />
                </TabsContent>
                <TabsContent value="candidates">
                    <CandidatePerformanceTable results={results} candidates={candidates} detailedData={detailedStats} />
                </TabsContent>
                <TabsContent value="analytics">
                    <ParticipationAnalyticsView analyticsData={analyticsData} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
