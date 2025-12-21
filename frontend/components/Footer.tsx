'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Youtube, Instagram } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import DeveloperCard from '@/components/DeveloperCard';

export default function Footer() {
    const [isDevModalOpen, setIsDevModalOpen] = useState(false);

    return (
        <footer className="footer-section">
            <Modal
                isOpen={isDevModalOpen}
                onClose={() => setIsDevModalOpen(false)}
                title="Developer Profile"
            >
                <DeveloperCard />
            </Modal>

            <div className="container mx-auto px-4">
                <div className="footer-content pt-5 pb-5">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-20">
                        <div className="mb-8 lg:mb-0 lg:w-1/2">
                            <div className="footer-widget">
                                <div className="footer-logo mb-1">
                                    <Link href="/" className="text-3xl font-bold text-white font-achiko">SARGOLSAVAM</Link>
                                </div>
                                <div className="footer-text mb-6">
                                    <p className="text-gray-400 text-sm leading-7">
                                        Azharul Uloom College of Islamic and Linguistic Studies<br />
                                        Chalakkal East, Keezhmad, Marampally, Kerala 683105
                                    </p>
                                </div>
                                <div className="footer-social-icon">
                                    <span className="block text-white text-xl font-bold mb-5">Follow us</span>
                                    <div className="flex gap-4">
                                        <a href="https://www.facebook.com/sargolsavamazhar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#3B5998] flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 hover:shadow-lg"><Facebook size={18} /></a>
                                        <a href="https://www.youtube.com/@artssportsazhar4556" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 hover:shadow-lg"><Youtube size={18} /></a>
                                        <a href="https://www.instagram.com/azharsargolsavam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#E1306C] flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 hover:shadow-lg"><Instagram size={18} /></a>
                                        <a href="https://whatsapp.com/channel/0029VawdjdQ9mrGcSAsOYC2E" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 hover:shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-8 lg:mb-0 lg:w-1/3">
                            <div className="footer-widget">
                                <div className="footer-widget-heading mb-8 relative">
                                    <h3 className="text-white text-xl font-semibold relative z-10 before:content-[''] before:absolute before:left-0 before:-bottom-4 before:h-0.5 before:w-12 before:bg-primary">Useful Links</h3>
                                </div>
                                <ul className="grid grid-cols-2 gap-3">
                                    <li><Link href="/" className="text-gray-400 hover:text-primary text-sm capitalize">Home</Link></li>
                                    <li><Link href="/schedule" className="text-gray-400 hover:text-primary text-sm capitalize">Schedule</Link></li>
                                    <li><Link href="/results" className="text-gray-400 hover:text-primary text-sm capitalize">Results</Link></li>
                                    <li><Link href="/committee" className="text-gray-400 hover:text-primary text-sm capitalize">Committee</Link></li>
                                    <li><Link href="/#about" className="text-gray-400 hover:text-primary text-sm capitalize">About</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-area bg-[#202020] py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
                        <div className="copyright-text mb-4 lg:mb-0">
                            <p className="text-gray-400 text-sm">
                                &copy; 2025 Sargolsavam <span className="mx-2">|</span>
                                <button
                                    onClick={() => setIsDevModalOpen(true)}
                                    className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 inline font-inherit"
                                >
                                    Developed by Haneen Hyder PK
                                </button>
                            </p>
                        </div>
                        <div className="footer-menu">
                            <ul className="flex gap-5">
                                <li><Link href="/" className="text-gray-400 hover:text-primary text-sm">Home</Link></li>
                                <li><Link href="/terms" className="text-gray-400 hover:text-primary text-sm">Terms</Link></li>
                                <li><Link href="/privacy" className="text-gray-400 hover:text-primary text-sm">Privacy</Link></li>
                                <li><Link href="/policy" className="text-gray-400 hover:text-primary text-sm">Policy</Link></li>
                                <li><Link href="/committee" className="text-gray-400 hover:text-primary text-sm">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
