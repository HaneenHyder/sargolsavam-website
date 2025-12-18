'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/Card";
import { User, Phone } from 'lucide-react';

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
                <div className="flex justify-center gap-3 mt-2">
                    {member.phone && (
                        <a
                            href={`tel:${member.phone.replace(/\s/g, '')}`}
                            className="p-3 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-all duration-300 text-primary"
                            aria-label={`Call ${member.name}`}
                        >
                            <Phone size={24} />
                        </a>
                    )}
                    {member.phone && (
                        <a
                            href={`https://wa.me/${member.phone.replace(/[\s+]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-green-100 hover:bg-green-500 transition-all duration-300 group"
                            aria-label={`WhatsApp ${member.name}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-green-600 group-hover:text-white"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
