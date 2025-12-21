
import Image from 'next/image';

export default function LogoPage() {
    return (
        <div className="bg-gray-50 text-gray-800 antialiased selection:bg-primary selection:text-white min-h-screen">


            {/* Main Content Wrapper */}
            <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">

                {/* SECTION 1: LOGO & CONCEPT */}
                <section className="flex flex-col items-center text-center space-y-10">

                    {/* Logo Visualization */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-theme-gradient rounded-full opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
                        <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white p-6">
                            {/* Actual Logo Image */}
                            <Image
                                src="/assets/logo/logo.jpeg"
                                alt="Sargolsavam Logo"
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                    </div>

                    {/* Title Block */}
                    <div className="space-y-2">
                        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-primary-dark font-achiko">SARGOLSAVAM</h1>
                        <p className="text-xl sm:text-2xl font-medium text-primary">Azharul Uloom Arts Fest 2025-26</p>
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-gray-200 rounded-full"></div>

                    {/* Concept Text */}
                    <div className="max-w-3xl text-left bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Concept</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            The logo of <span className="font-semibold text-primary-dark">"Sargolsavam Azharul Uloom Arts Fest 2025-26"</span> represents a fusion of artistic elements that rise from the foundation of knowledge. At the base is the <span className="font-medium text-primary">pen nib</span>, symbolizing Azharul Uloom&apos;s commitment to education and the clarity of thought from which all creativity begins.
                        </p>
                        <br />
                        <p className="text-gray-700 leading-relaxed text-lg">
                            From this foundation, two smooth brush-like strokes emerge, not as a flame but as an abstract artistic form that subtly shapes the letter <span className="font-semibold">"S"</span> for Sargolsavam. These strokes express movement, growth, and the rising confidence of students as they transform ideas into performance and expression.
                        </p>
                        <br />
                        <p className="text-gray-700 leading-relaxed text-lg">
                            The <span className="font-medium text-primary-dark">royal purple color</span> brings dignity and imagination, highlighting both artistic freedom and the drive to excel in the competitive spirit of the fest. The upward design also stands as a gentle tribute to oppressed communities, especially the people of Palestine, whose resilience and unbroken voice continue to inspire. With its blend of elegance and playfulness, the logo becomes a symbol of creativity, ambition, and the responsibility to use art as a voice for the unheard.
                        </p>
                    </div>
                </section>

                {/* SECTION 2: BRAND ASSETS */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* Typography Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4"></div>
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 relative z-10">Typography</h2>

                        <div className="flex-grow space-y-6 relative z-10">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Logotype</p>
                                <h3 className="text-4xl font-black text-primary-dark tracking-wide break-words font-achiko">SARGOLSAVAM</h3>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-2">Font Family</p>
                                <p className="text-xl font-bold text-gray-800">ACHICO REGULAR</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-3">Character Set</p>
                                <div className="p-4 bg-gray-50 rounded-lg text-gray-600 font-bold tracking-widest leading-loose break-words text-lg font-achiko">
                                    ABCDEFGHIJKL<br />MNOPQRSTUVWXYZ
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Color Palette Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4"></div>
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 relative z-10">Color Palette</h2>

                        <div className="flex-grow space-y-6 relative z-10">

                            {/* Color 1 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl shadow-md bg-primary-dark transition-transform group-hover:scale-105"></div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-800">#381A64</p>
                                        <p className="text-sm text-gray-500">Royal Purple / Dark Brand</p>
                                    </div>
                                </div>
                            </div>

                            {/* Plus Sign visual */}
                            <div className="pl-8 text-2xl text-gray-300 font-light">+</div>

                            {/* Color 2 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl shadow-md bg-primary transition-transform group-hover:scale-105"></div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-800">#8842C9</p>
                                        <p className="text-sm text-gray-500">Vivid Violet / Light Accent</p>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Example */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-3">Gradient Usage</p>
                                <div className="h-12 w-full rounded-xl bg-theme-gradient shadow-inner flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold tracking-widest opacity-90">PRIMARY GRADIENT</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </section>

            </main>
        </div>
    );
}
