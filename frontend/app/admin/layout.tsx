'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard, Calendar, Trophy, FileText, Upload, Menu, X, Users, Bell } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, logout, loading } = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                router.push('/login');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <NavContent setIsMobileMenuOpen={setIsMobileMenuOpen} logout={logout} />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-20 flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
                <button onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <NavContent setIsMobileMenuOpen={setIsMobileMenuOpen} logout={logout} />
            </aside>

            <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-16 md:mt-0">
                {children}
            </main>
        </div>
    );
}

function NavContent({ setIsMobileMenuOpen, logout }: { setIsMobileMenuOpen: (open: boolean) => void, logout: () => void }) {
    return (
        <>
            <div className="p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
                <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>
                <Link
                    href="/admin/analytics"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Trophy size={20} />
                    Analytics
                </Link>
                <Link
                    href="/admin/events"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Calendar size={20} />
                    Manage Events
                </Link>
                <Link
                    href="/admin/leaderboard"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Trophy size={20} />
                    Leaderboard
                </Link>
                <Link
                    href="/admin/schedule"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Calendar size={20} />
                    Manage Schedule
                </Link>
                <Link
                    href="/admin/import"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Upload size={20} />
                    Import Data
                </Link>
                <Link
                    href="/admin/audit-logs"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <FileText size={20} />
                    Audit Logs
                </Link>
                <Link
                    href="/admin/judges-notification"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Bell size={20} />
                    Judges Notification
                </Link>

                {/* Appeals Hidden Temporarily
                <Link
                    href="/admin/appeals"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <FileText size={20} />
                    Appeals
                </Link>
                */}

            </nav>
            <div className="p-4 border-t">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </>
    );
}


