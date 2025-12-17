'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CommitteeMemberForm from '@/components/admin/CommitteeMemberForm';

interface Member {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    image: string;
    display_order: number;
}

export default function AdminCommitteePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchMembers = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/committee`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleEdit = (member: Member) => {
        setSelectedMember(member);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setSelectedMember(null);
    };

    const handleSave = () => {
        fetchMembers(); // Refresh list after update
    };

    const handleReorder = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === members.length - 1) return;

        const newMembers = [...members];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];

        // Update display_order for all (or just swapped)
        // Simple approach: re-assign order based on index
        const updatedMembers = newMembers.map((m, i) => ({ ...m, display_order: i }));

        setMembers(updatedMembers);

        // Save to backend
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            await fetch(`${apiUrl}/committee/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: updatedMembers.map(m => ({ id: m.id, display_order: m.display_order }))
                }),
            });
        } catch (error) {
            console.error("Error saving order:", error);
            // Revert on error? For now, just log.
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="outline" size="sm">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Committee</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Edit member details and update profile photos.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member, index) => (
                        <Card key={member.id} className="relative group">
                            <CardContent className="pt-6 flex flex-col items-center text-center space-y-3">
                                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleReorder(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        ▲
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleReorder(index, 'down')}
                                        disabled={index === members.length - 1}
                                    >
                                        ▼
                                    </Button>
                                </div>
                                <div className="w-24 h-24 relative bg-gray-100 rounded-full overflow-hidden">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <p className="text-primary text-sm font-medium">{member.role}</p>
                                    {member.department && <p className="text-xs text-gray-500">{member.department}</p>}
                                </div>
                                <div className="text-sm text-gray-500 w-full break-all">
                                    <p>{member.email}</p>
                                    <p>{member.phone}</p>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full mt-4 gap-2"
                                    onClick={() => handleEdit(member)}
                                >
                                    <Edit size={16} /> Edit Details
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <CommitteeMemberForm
                member={selectedMember}
                isOpen={isFormOpen}
                onClose={handleClose}
                onSave={handleSave}
            />
        </div>
    );
}
