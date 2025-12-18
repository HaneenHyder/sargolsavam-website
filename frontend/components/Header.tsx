import Link from 'next/link';
import Image from 'next/image';
import MobileSidebar from './MobileSidebar';

export default function Header() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-10 h-10 bg-white">
                        <Image
                            src="/assets/logo/logo.jpeg"
                            alt="Sargolsavam Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-achiko text-3xl pt-[10px] bg-clip-text text-transparent bg-theme-gradient">SARGOLSAVAM</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
                    <Link href="/schedule" className="text-gray-600 hover:text-primary transition-colors">Schedule</Link>
                    <Link href="/results" className="text-gray-600 hover:text-primary transition-colors">Results</Link>
                    <Link href="/committee" className="text-gray-600 hover:text-primary transition-colors">Committee</Link>
                    <Link href="/login" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                        Login
                    </Link>
                </nav>

                {/* Mobile Menu */}
                <MobileSidebar />
            </div>
        </header>
    );
}
