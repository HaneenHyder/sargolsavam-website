'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <div className="md:hidden">
            <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:text-primary transition-colors">
                <Menu size={24} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 bg-white">
                                <Image
                                    src="/assets/logo/logo.jpeg"
                                    alt="Sargolsavam Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-achiko text-2xl text-primary">Menu</span>
                        </div>
                        <button onClick={closeSidebar} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-4">
                        <Link
                            href="/"
                            onClick={closeSidebar}
                            className="text-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-lg transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/schedule"
                            onClick={closeSidebar}
                            className="text-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-lg transition-colors"
                        >
                            Schedule
                        </Link>
                        <Link
                            href="/results"
                            onClick={closeSidebar}
                            className="text-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-lg transition-colors"
                        >
                            Results
                        </Link>
                        <Link
                            href="/committee"
                            onClick={closeSidebar}
                            className="text-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-lg transition-colors"
                        >
                            Committee
                        </Link>
                        <div className="pt-4 mt-auto">
                            <Link href="/login" onClick={closeSidebar}>
                                <Button className="w-full text-lg h-12">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}
