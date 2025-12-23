'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Edit2, Save, X, Trophy } from 'lucide-react';

interface Result {
    id: string; // participant id
    event_name: string;
    candidate_name: string;
    chest_no: string;
    team_name: string;
    position: number | null;
    grade: string | null;
    points: number;
    item_type: string;
    category: string;
}

export default function PublishedResultsPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ position: '', grade: '', points: 0 });

    const [categoryFilter, setCategoryFilter] = useState('All');
    const [resultTypeFilter, setResultTypeFilter] = useState('All');

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/results/published`);
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else {
                console.error('Failed to fetch results');
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (result: Result) => {
        setEditingId(result.id);
        setEditForm({
            position: result.position ? result.position.toString() : '',
            grade: result.grade || '',
            points: result.points || 0
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSave = async (id: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/results/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth token if needed, usually handled by HttpOnly cookie or helper
                },
                body: JSON.stringify({
                    position: editForm.position,
                    grade: editForm.grade,
                    points: editForm.points
                })
            });

            if (response.ok) {
                setEditingId(null);
                fetchResults(); // Refresh list
            } else {
                alert('Failed to update result');
            }
        } catch (error) {
            console.error('Error updating result:', error);
            alert('Error updating result');
        }
    };

    const filteredResults = results.filter(r => {
        const matchesSearch = r.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.candidate_name && r.candidate_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (r.team_name && r.team_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;

        const matchesType = resultTypeFilter === 'All' ||
            (resultTypeFilter === 'Winners' && r.position !== null) ||
            (resultTypeFilter === 'With Grade' && r.grade !== null);

        return matchesSearch && matchesCategory && matchesType;
    });

    const categories = ['All', ...Array.from(new Set(results.map(r => r.category))).filter(Boolean).sort()];

    if (loading) return <div className="p-8 text-center text-gray-500">Loading published results...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Published Results</h1>
                <p className="text-gray-500 text-sm mt-1">
                    View and edit results that have been declared
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by event, candidate, or team..."
                    className="flex-1 p-2 border rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="p-2 border rounded-md min-w-[150px]"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                    ))}
                </select>

                <select
                    className="p-2 border rounded-md min-w-[150px]"
                    value={resultTypeFilter}
                    onChange={(e) => setResultTypeFilter(e.target.value)}
                >
                    <option value="All">All Results</option>
                    <option value="Winners">Winners (1st, 2nd, 3rd)</option>
                    <option value="With Grade">With Grade</option>
                </select>
            </div>

            <div className="bg-white rounded-md shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResults.map((result) => (
                            <tr key={result.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{result.event_name}</div>
                                    <div className="text-xs text-gray-500">{result.category}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{result.candidate_name || result.team_name}</div>
                                    {result.chest_no && <div className="text-xs text-gray-500">#{result.chest_no}</div>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingId === result.id ? (
                                        <div className="flex gap-2">
                                            <select
                                                className="border rounded p-1 text-sm"
                                                value={editForm.position}
                                                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                            >
                                                <option value="">None</option>
                                                <option value="1">1st</option>
                                                <option value="2">2nd</option>
                                                <option value="3">3rd</option>
                                            </select>
                                            <select
                                                className="border rounded p-1 text-sm"
                                                value={editForm.grade}
                                                onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                                            >
                                                <option value="">No Grade</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {result.position && (
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${result.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                    result.position === 2 ? 'bg-gray-100 text-gray-800' :
                                                        'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {result.position === 1 ? '1st' : result.position === 2 ? '2nd' : '3rd'}
                                                </span>
                                            )}
                                            {result.grade && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                                                    Grade {result.grade}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingId === result.id ? (
                                        <input
                                            type="number"
                                            className="w-16 border rounded p-1"
                                            value={editForm.points}
                                            onChange={(e) => setEditForm({ ...editForm, points: parseInt(e.target.value) || 0 })}
                                        />
                                    ) : (
                                        result.points
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {editingId === result.id ? (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleSave(result.id)} className="text-green-600 hover:text-green-900">
                                                <Save size={18} />
                                            </button>
                                            <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleEditClick(result)} className="text-indigo-600 hover:text-indigo-900">
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredResults.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No published results found.
                </div>
            )}
        </div>
    );
}
