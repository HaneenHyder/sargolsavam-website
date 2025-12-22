'use client';

import MemberCard from "@/components/committee/MemberCard";
import committeeData from "@/content/committee.json";

interface Member {
    id?: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    image: string;
    instagram?: string;
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
    // Sort logic
    const members = [...committeeData]
        .filter(m => m.name !== 'Nayeef Panayikulam')
        .sort((a, b) => {
            const indexA = ORDERED_NAMES.indexOf(a.name);
            const indexB = ORDERED_NAMES.indexOf(b.name);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
        })
        .map((member, index) => ({
            ...member,
            id: `static-${index}-${member.name.replace(/\s+/g, '-').toLowerCase()}`
        }));

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
                    <MemberCard key={index} member={member} />
                ))}
            </div>

            <div className="text-center text-sm text-gray-500 mt-12 py-8 border-t max-w-3xl mx-auto">
                <p>Each member of the organizing committee contributed actively to planning, coordination, and successful execution of the festival.</p>
            </div>
        </div>
    );
}
