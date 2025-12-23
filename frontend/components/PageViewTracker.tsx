'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
    const pathname = usePathname();
    const sessionIdRef = useRef<string>('');

    useEffect(() => {
        // Generate or retrieve session ID
        if (!sessionIdRef.current) {
            const storedSessionId = sessionStorage.getItem('session_id');
            if (storedSessionId) {
                sessionIdRef.current = storedSessionId;
            } else {
                const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                sessionStorage.setItem('session_id', newSessionId);
                sessionIdRef.current = newSessionId;
            }
        }
    }, []);

    useEffect(() => {
        const trackView = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                await fetch(`${API_URL}/api/track-view`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pageUrl: pathname,
                        referrer: document.referrer,
                        sessionId: sessionIdRef.current
                    })
                });
            } catch (error) {
                console.error('Failed to track page view:', error);
            }
        };

        // Track page view when pathname changes
        if (pathname && sessionIdRef.current) {
            trackView();
        }
    }, [pathname]);

    return null;
}
