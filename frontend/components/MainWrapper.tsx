'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isLogoPage = pathname?.startsWith('/logo');

    if (isAdmin || isLogoPage) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <main className="flex-1 container mx-auto px-4 py-8">
            {children}
        </main>
    );
}
