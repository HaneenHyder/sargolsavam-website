'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/Card";
import { User, Mail, Phone } from 'lucide-react';

interface Member {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    image: string;
}

export default function MemberCard({ member }: { member: Member }) {
    const [imgError, setImgError] = useState(false);

    return (
        <Card className="hover:shadow-lg transition-shadow pt-6">
            <div className="w-48 h-48 mx-auto relative bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-sm">
                {!imgError && member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                        unoptimized={process.env.NODE_ENV === 'development'} // Optional: helps with local debugging if sharp invalid
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                        <User className="w-20 h-20 opacity-50" />
                    </div>
                )}
            </div>
            <CardContent className="text-center p-4 space-y-3">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
                    {member.email && (
                        <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Mail size={14} />
                            <span>{member.email}</span>
                        </a>
                    )}
                    {member.phone && (
                        <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Phone size={14} />
                            <span>{member.phone}</span>
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
