import Image from 'next/image';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';

export default function DeveloperCard() {
    return (
        <div className="flex flex-col items-center text-center p-2">
            <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                <Image
                    src="/assets/committee/Haneen Hyder PK.jpeg"
                    alt="Haneen Hyder PK"
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-lg"
                />
            </div>

            <h3 className="text-2xl font-bold font-achiko text-primary mb-1">Haneen Hyder PK</h3>
            <p className="text-gray-500 font-medium mb-6">Frontend Developer</p>

            <div className="flex justify-center gap-4 flex-wrap">
                <a
                    href="https://github.com/HaneenHyder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-800 hover:text-white transition-all hover:scale-110 hover:shadow-md group"
                    title="GitHub"
                >
                    <Github size={20} />
                </a>

                <a
                    href="https://www.linkedin.com/in/haneenhyder/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-50 rounded-full hover:bg-[#0077b5] hover:text-white transition-all hover:scale-110 hover:shadow-md text-[#0077b5]"
                    title="LinkedIn"
                >
                    <Linkedin size={20} />
                </a>

                <a
                    href="https://www.instagram.com/h.aneeeenn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-pink-50 rounded-full hover:bg-[#E1306C] hover:text-white transition-all hover:scale-110 hover:shadow-md text-[#E1306C]"
                    title="Instagram"
                >
                    <Instagram size={20} />
                </a>

                <a
                    href="mailto:nanuhaneen@gmail.com"
                    className="p-3 bg-red-50 rounded-full hover:bg-red-500 hover:text-white transition-all hover:scale-110 hover:shadow-md text-red-500"
                    title="Email"
                >
                    <Mail size={20} />
                </a>

                <a
                    href="https://wa.me/919847957566"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-green-50 rounded-full hover:bg-[#25D366] hover:text-white transition-all hover:scale-110 hover:shadow-md text-[#25D366]"
                    title="WhatsApp"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </a>
            </div>

            <div className="mt-8 pt-4 border-t w-full">
                <p className="text-xs text-gray-400 italic">"Turning coffee into code & ideas into reality"</p>
            </div>
        </div>
    );
}
