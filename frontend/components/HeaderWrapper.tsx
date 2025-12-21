'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
    const pathname = usePathname();
    const isExcluded = pathname?.startsWith('/admin');

    if (isExcluded) {
        return null;
    }

    return <Header />;
}
