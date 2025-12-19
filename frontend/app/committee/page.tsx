import Link from "next/link";
import MemberCard from "@/components/committee/MemberCard";

export const dynamic = 'force-dynamic';

interface Member {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    image: string;
}

async function getCommitteeMembers(): Promise<Member[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/committee`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch committee members');
        }

        return res.json();
    } catch (error) {
        console.error("Error loading committee members:", error);
        return [];
    }
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

export default async function CommitteePage() {
    let members = await getCommitteeMembers();

    // Sort members based on the predefined order
    members = members.filter(m => m.name !== 'Nayeef Panayikulam')
        .sort((a, b) => {
            const indexA = ORDERED_NAMES.indexOf(a.name);
            const indexB = ORDERED_NAMES.indexOf(b.name);

            // If both are in the list, sort by index
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }

            // If only A is in the list, it comes first
            if (indexA !== -1) return -1;

            // If only B is in the list, it comes first
            if (indexB !== -1) return 1;

            // If neither is in the list, keep original order (or sort alphabetically if preferred)
            return 0;
        });

    return (
        <div className="space-y-12 py-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-primary font-achiko tracking-wide">
                    Organizing Committee
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    The dedicated team working behind the scenes to make Sargolsavam 2025-26 a grand success.
                </p>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 sm:px-0">
                {members.map((member, index) => (
                    <MemberCard key={member.id || index} member={member} />
                ))}
            </div>

            {members.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>No committee members found.</p>
                </div>
            )}
        </div>
    );
}
