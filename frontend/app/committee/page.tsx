'use client';

import { useState, useEffect } from "react";
import MemberCard from "@/components/committee/MemberCard";
import { Loader2 } from "lucide-react";

interface Member {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    image: string;
}

const ORDERED_NAMES = [
    "Abdul Ahad Nadwi",
    "Hanan AP",
    "VA Sajadh",
    "Haneen Hyder PK",
    "Adnan Muhammed",
    "Ahmad Deedat",
    "Jasim VP",
    "Muhammed Shaheeb MC",
    "Shameem Ahammed",
    "Ahsan Malik",
    "Muhammed Ali",
    "Ashif K",
    "Muhammed Lamigh",
    "Ziyad",
    "Ajmal Noushad"
];

export default function CommitteePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                console.log('Fetching committee from:', apiUrl);

                const res = await fetch(`${apiUrl}/api/committee`);

                if (!res.ok) {
                    throw new Error('Failed to fetch committee members');
                }

                let data: Member[] = await res.json();

                // Filter and Sort
                data = data.filter(m => m.name !== 'Nayeef Panayikulam')
                    .sort((a, b) => {
                        const indexA = ORDERED_NAMES.indexOf(a.name);
                        const indexB = ORDERED_NAMES.indexOf(b.name);

                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;
                        return 0;
                    });

                setMembers(data);
            } catch (err) {
                console.error("Error loading committee members:", err);
                setError('Failed to load committee members.');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500">Loading committee members...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 py-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-primary font-achiko tracking-wide">
                    Organizing Committee
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    The committed individuals guiding, coordinating, and executing Sargolsavam 2025–26.
                </p>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 sm:px-0">
                {members.map((member, index) => (
                    <MemberCard key={member.id || index} member={member} />
                ))}
            </div>

            {members.length === 0 && !error && (
                <div className="text-center py-12 text-gray-500">
                    <p>No committee members found.</p>
                </div>
            )}

            {error && (
                <div className="text-center py-12 text-red-500">
                    <p>{error}</p>
                </div>
            )}

            <div className="text-center text-sm text-gray-500 mt-12 py-8 border-t max-w-3xl mx-auto">
                <p>Each member of the organizing committee contributed actively to planning, coordination, and successful execution of the festival.</p>
            </div>
        </div>
    );
}
