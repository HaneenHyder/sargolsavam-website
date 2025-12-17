import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return <div className={`p-4 border-b border-gray-50 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return <h3 className={`font-bold text-lg ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}
