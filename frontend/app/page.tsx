"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { useState, useEffect } from "react";
import { ScrollText, ShieldCheck, Receipt } from "lucide-react";

export default function Home() {
    const [videoEnded, setVideoEnded] = useState(false);

    useEffect(() => {
        // Check session storage on mount
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
        if (hasSeenIntro) {
            setVideoEnded(true);
        }
    }, []);

    const handleVideoEnd = () => {
        setVideoEnded(true);
        sessionStorage.setItem('hasSeenIntro', 'true');
    };

    // Hide scrollbar during video playback
    useEffect(() => {
        if (!videoEnded) {
            document.documentElement.classList.add('hide-scrollbar');
        } else {
            document.documentElement.classList.remove('hide-scrollbar');
        }
        return () => {
            document.documentElement.classList.remove('hide-scrollbar');
        };
    }, [videoEnded]);

    // Skip video on key press
    useEffect(() => {
        const handleKeyPress = () => {
            if (!videoEnded) {
                handleVideoEnd();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [videoEnded]);

    return (
        <div className="flex flex-col w-full">
            {/* Full Screen Video Intro */}
            <div
                className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-1000 ${videoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={handleVideoEnd}
                onTouchStart={handleVideoEnd}
            >
                <video
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    className="w-full h-full object-cover"
                >
                    <source src="/assets/videos/intro.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Hero Section */}
            <section className="relative w-full min-h-[50vh] md:min-h-[80vh] flex flex-col justify-center items-center py-12 md:py-0 overflow-hidden">
                <div className="relative z-10 text-center space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="space-y-2">
                        <div className="inline-block bg-primary/10 rounded-full px-6 py-2 mb-4 backdrop-blur-sm">
                            <p className="text-sm sm:text-lg font-medium text-primary">December 23 & 24, 2025-26</p>
                        </div>
                        <h1 className="font-extrabold tracking-tight font-achiko text-primary pt-[8px] mt-0 drop-shadow-sm leading-none flex flex-col items-center">
                            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl">SARGOLSAVAM</span>
                            <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-2 md:mt-4">2025-26</span>
                        </h1>
                        <p className="text-lg sm:text-2xl text-gray-600 font-light drop-shadow-sm">
                            Azharul Uloom College of Islamic & Linguistic Studies, Aluva
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Link href="/results">
                            <Button size="lg" className="text-lg px-8 h-12 shadow-lg">
                                View Results
                            </Button>
                        </Link>
                        <Link href="/committee">
                            <Button variant="outline" size="lg" className="text-lg px-8 h-12 bg-white/80 backdrop-blur-sm hover:bg-white/90">
                                Committee
                            </Button>
                        </Link>
                        <Link href="/stages">
                            <Button variant="outline" size="lg" className="text-lg px-8 h-12 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:text-primary border-primary/20">
                                Stages
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="secondary" size="lg" className="text-lg px-8 h-12 shadow-lg">
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Event Highlights */}
            <section className="w-full min-h-[50vh] md:min-h-[80vh] flex flex-col justify-center items-center bg-white py-12 md:py-0">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full max-w-7xl px-4">
                    <Card className="bg-primary/5 border-none shadow-sm hover:shadow-md transition-shadow w-[45%] sm:w-[35%] lg:w-[20%] aspect-square flex flex-col items-center justify-center">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <CountUp end={50} className="text-4xl sm:text-5xl md:text-6xl font-bold font-achiko text-primary mb-4" />
                            <span className="text-xl sm:text-2xl text-gray-600 font-medium">Days</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-none shadow-sm hover:shadow-md transition-shadow w-[45%] sm:w-[35%] lg:w-[20%] aspect-square flex flex-col items-center justify-center">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <CountUp end={138} className="text-4xl sm:text-5xl md:text-6xl font-bold font-achiko text-primary mb-4" />
                            <span className="text-xl sm:text-2xl text-gray-600 font-medium">Events</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-none shadow-sm hover:shadow-md transition-shadow w-[45%] sm:w-[35%] lg:w-[20%] aspect-square flex flex-col items-center justify-center">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <CountUp end={5} className="text-4xl sm:text-5xl md:text-6xl font-bold font-achiko text-primary mb-4" />
                            <span className="text-xl sm:text-2xl text-gray-600 font-medium">Stages</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-none shadow-sm hover:shadow-md transition-shadow w-[45%] sm:w-[35%] lg:w-[20%] aspect-square flex flex-col items-center justify-center">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <CountUp end={3} className="text-4xl sm:text-5xl md:text-6xl font-bold font-achiko text-primary mb-4" />
                            <span className="text-xl sm:text-2xl text-gray-600 font-medium">Groups</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-none shadow-sm hover:shadow-md transition-shadow w-[45%] sm:w-[35%] lg:w-[20%] aspect-square flex flex-col items-center justify-center">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <CountUp end={200} className="text-4xl sm:text-5xl md:text-6xl font-bold font-achiko text-primary mb-4" />
                            <span className="text-xl sm:text-2xl text-gray-600 font-medium">Candidates</span>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="w-full min-h-[50vh] md:min-h-[80vh] flex flex-col justify-center items-center bg-gray-50 py-12 md:py-0">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">About</h2>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        <span className="text-primary font-medium">Sargolsavam</span> is the annual cultural arts festival of <span className="text-primary font-medium">Azharul Uloom College of Islamic and Linguistic Studies</span>, serving as a vibrant platform for students to explore, express, and enhance their creative talents across a wide range of artistic disciplines. The festival encourages students to discover their abilities in art, literature, and performance while providing an environment that nurtures imagination, innovation, and artistic excellence. Through healthy competition and collaborative participation, <span className="text-primary font-medium">Sargolsavam</span> helps build confidence, teamwork, and a strong sense of unity among students. It celebrates diversity in art and culture, promotes mutual respect, and inspires students to communicate ideas and emotions through creative expression. More than a celebration, <span className="text-primary font-medium">Sargolsavam</span> stands as a space where talent is refined, voices are amplified, and creativity becomes a shared experience that strengthens both individual growth and the collective spirit of the campus.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-8">
                        <Link href="/terms">
                            <Button variant="outline" className="h-auto py-3 px-6 text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-white hover:shadow-md transition-all duration-300 gap-2.5 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm group">
                                <ScrollText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Terms & Conditions</span>
                            </Button>
                        </Link>
                        <Link href="/privacy">
                            <Button variant="outline" className="h-auto py-3 px-6 text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-white hover:shadow-md transition-all duration-300 gap-2.5 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm group">
                                <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Privacy Policy</span>
                            </Button>
                        </Link>
                        <Link href="/policy">
                            <Button variant="outline" className="h-auto py-3 px-6 text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-white hover:shadow-md transition-all duration-300 gap-2.5 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm group">
                                <Receipt className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Refund Policy</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
