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

                // Use relative path for proxy
                await fetch('/api/analytics', {
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
