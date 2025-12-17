import Link from 'next/link';
import { Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer-section">
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
                                &copy; 2025 Sargolsavam <span className="mx-2">|</span> <a href="https://www.linkedin.com/in/haneenhyder/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Developed by Haneen Hyder PK</a>
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
