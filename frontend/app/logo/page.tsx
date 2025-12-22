"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LogoPage() {
    return (
        <div className="bg-gray-50 text-gray-800 antialiased selection:bg-primary selection:text-white min-h-screen">


            {/* Main Content Wrapper */}
            <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">

                {/* SECTION 1: LOGO & CONCEPT */}
                <section className="flex flex-col items-center text-center space-y-10">

                    {/* Logo Visualization */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-theme-gradient rounded-full opacity-20 blur-2xl transition duration-500 group-hover:opacity-40 animate-pulse-slow"></div>
                        <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white p-6 z-10 ring-1 ring-gray-100">
                            {/* Actual Logo Image */}
                            <Image
                                src="/assets/logo/logo.jpeg"
                                alt="Sargolsavam Logo"
                                fill
                                className="object-contain p-4 rounded-full"
                            />
                        </div>
                    </motion.div>

                    {/* Title Block */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="space-y-4"
                    >
                        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-theme-gradient font-achiko drop-shadow-sm">
                            SARGOLSAVAM
                        </h1>
                        <p className="text-xl sm:text-3xl font-medium text-slate-600 tracking-wide">
                            Azharul Uloom Arts Fest 2025-26
                        </p>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 96 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="h-1.5 bg-gray-200 rounded-full"
                    />

                    {/* Concept Text */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl text-left bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-lg border border-white/50 ring-1 ring-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-1 bg-primary rounded-full"></div>
                            <h2 className="text-xs font-bold text-primary uppercase tracking-[0.3em]">The Concept</h2>
                        </div>

                        <div className="space-y-6 text-lg sm:text-xl text-slate-700 leading-relaxed font-light">
                            <p>
                                The logo of <span className="font-semibold text-primary-dark">"Sargolsavam Azharul Uloom Arts Fest 2025-26"</span> represents a fusion of artistic elements that rise from the foundation of knowledge. At the base is the <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">pen nib</span>, symbolizing Azharul Uloom&apos;s commitment to education and the clarity of thought from which all creativity begins.
                            </p>
                            <p>
                                From this foundation, two smooth brush-like strokes emerge, not as a flame but as an abstract artistic form that subtly shapes the letter <span className="font-bold text-slate-900">"S"</span> for Sargolsavam. These strokes express movement, growth, and the rising confidence of students as they transform ideas into performance and expression.
                            </p>
                            <p>
                                The <span className="font-medium text-primary-dark bg-primary-dark/5 px-2 py-0.5 rounded-md">royal purple color</span> brings dignity and imagination, highlighting both artistic freedom and the drive to excel in the competitive spirit of the fest. The upward design also stands as a gentle tribute to oppressed communities, especially the people of Palestine, whose resilience and unbroken voice continue to inspire. With its blend of elegance and playfulness, the logo becomes a symbol of creativity, ambition, and the responsibility to use art as a voice for the unheard.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* SECTION: BRAND VIDEO */}
                <section className="w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full aspect-video rounded-3xl shadow-2xl overflow-hidden border-4 border-white bg-black ring-1 ring-gray-200"
                    >
                        <div className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-white tracking-widest uppercase">Official Teaser</span>
                            </div>
                        </div>
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-90"
                        >
                            <source src="/assets/videos/intro.mp4" type="video/mp4" />
                        </video>
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                    </motion.div>
                </section>

                {/* SECTION 2: BRAND ASSETS */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* Typography Card */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group bg-white p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col h-full relative overflow-hidden transition-all hover:shadow-xl hover:border-primary/20"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-primary/5"></div>

                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <span className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                <span className="text-xl font-serif font-bold">Aa</span>
                            </span>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Typography</h2>
                        </div>

                        <div className="flex-grow space-y-8 relative z-10">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Logotype</p>
                                <h3 className="text-4xl sm:text-5xl font-black text-primary-dark tracking-wide break-words font-achiko">SARGOLSAVAM</h3>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Font Family</p>
                                <p className="text-2xl font-bold text-slate-800">ACHICO REGULAR</p>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Character Set</p>
                                <div className="p-6 bg-gray-50 rounded-2xl text-slate-600 font-bold tracking-widest leading-loose break-words text-xl font-achiko border border-gray-100 group-hover:border-primary/20 transition-colors">
                                    ABCDEFGHIJKL<br />MNOPQRSTUVWXYZ
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Color Palette Card */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group bg-white p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col h-full relative overflow-hidden transition-all hover:shadow-xl hover:border-primary/20"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-primary/5"></div>

                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <span className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                <div className="w-5 h-5 rounded-full bg-theme-gradient"></div>
                            </span>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Color Palette</h2>
                        </div>

                        <div className="flex-grow space-y-6 relative z-10">

                            {/* Color 1 */}
                            <div className="group/color cursor-pointer relative overflow-hidden rounded-2xl bg-gray-50 p-2 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 rounded-xl shadow-sm bg-primary-dark transition-transform group-hover/color:scale-105 group-hover/color:shadow-md"></div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-800 font-mono">#381A64</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary-dark"></span>
                                            <p className="text-sm text-gray-500 font-medium">Royal Purple</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Plus Sign visual */}
                            <div className="pl-10 text-3xl text-gray-200 font-light">+</div>

                            {/* Color 2 */}
                            <div className="group/color cursor-pointer relative overflow-hidden rounded-2xl bg-gray-50 p-2 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 rounded-xl shadow-sm bg-primary transition-transform group-hover/color:scale-105 group-hover/color:shadow-md"></div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-800 font-mono">#8842C9</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                                            <p className="text-sm text-gray-500 font-medium">Vivid Violet</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Example */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Gradient Usage</p>
                                <div className="h-16 w-full rounded-2xl bg-theme-gradient shadow-lg flex items-center justify-center relative overflow-hidden group/gradient">
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out skew-x-12"></div>
                                    <span className="text-white text-xs font-bold tracking-[0.3em] uppercase opacity-90 drop-shadow-md">Primary Gradient</span>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </section>

            </main>
        </div>
    );
}
