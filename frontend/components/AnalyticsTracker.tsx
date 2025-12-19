'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const trackView = async () => {
            try {
                // Don't track admin pages
                if (pathname?.startsWith('/admin')) return;

                // Use absolute path
                await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analytics`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pageUrl: pathname || window.location.pathname,
                    }),
                });
            } catch (error) {
                console.error('Failed to track view:', error);
            }
        };

        trackView();
    }, [pathname]);

    return null;
}
