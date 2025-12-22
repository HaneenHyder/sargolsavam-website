"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Mic2, BookOpen, Globe, Languages, Users } from "lucide-react";

export default function StagesPage() {
    const stages = [
        {
            id: 1,
            title: "Al-Aqsa Arena",
            subtitle: "Main Stage",
            icon: Mic2,
            meaning: "Al-Aqsa symbolizes faith, dignity, and spiritual resilience. As the Main Stage, Al-Aqsa Arena represents the heart of Sargolsavam—where major performances unfold, voices are amplified, and collective spirit is celebrated. It reflects strength, unity, and the central role of culture in preserving identity.",
            significance: "Heart of Sargolsavam, major performances, collective spirit."
        },
        {
            id: 2,
            title: "Qardawi Hall",
            subtitle: "Hostel Auditorium",
            icon: BookOpen,
            meaning: "Named in remembrance of scholarly thought and intellectual courage, Qardawi Hall represents knowledge, reasoning, and articulation. Hosting structured indoor programs, this stage aligns with disciplined performances that emphasize clarity of expression, thought, and refined presentation.",
            significance: "Knowledge, reasoning, articulation."
        },
        {
            id: 3,
            title: "Gaza Square",
            subtitle: "Open Stage",
            icon: Globe,
            meaning: "Gaza Square stands for openness, resistance, and unfiltered expression. As an open stage, it symbolizes freedom of voice and the power of art in public spaces. Performances here reflect spontaneity, courage, and the raw connection between artist and audience.",
            significance: "Openness, resistance, unfiltered expression."
        },
        {
            id: 4,
            title: "Al-Awda Chamber",
            subtitle: "Language Lab",
            icon: Languages,
            meaning: "Al-Awda means “return” — a return to roots, language, and identity. The Language Lab setting complements this meaning, making Al-Awda Chamber a space for linguistic excellence, literary expression, and intellectual depth. It highlights the role of language in cultural continuity.",
            significance: "Return to roots, language, identity."
        },
        {
            id: 5,
            title: "Handala Majlis",
            subtitle: "Samajam Hall",
            icon: Users,
            meaning: "Handala symbolizes unwavering hope and conscience, while Majlis denotes gathering and dialogue. Handala Majlis represents a space of reflection, creativity, and collective thought, ideal for intimate performances, discussions, and expressive arts that speak softly yet powerfully.",
            significance: "Unwavering hope, conscience, gathering."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <section className="relative w-full py-20 bg-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-dark via-primary to-secondary"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <Link href="/">
                            <Button variant="ghost" className="mb-4 hover:bg-gray-100/50 group">
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back to Home
                            </Button>
                        </Link>

                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-secondary font-medium tracking-widest text-sm uppercase">Discover</h2>
                            <h1 className="text-5xl md:text-7xl font-bold font-achiko text-primary">
                                THE STAGES
                            </h1>
                            <p className="max-w-2xl mx-auto text-lg text-gray-600 font-light pt-4">
                                Sargolsavam is not just an arts fest, but a story told through stages.
                                Each arena reflects resistance through culture, honoring identity, memory, and expression.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
            </section>

            {/* Stages Grid */}
            <div className="container mx-auto px-4 space-y-12 md:space-y-24">
                {stages.map((stage, index) => (
                    <section
                        key={stage.id}
                        className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-xl border border-gray-100 bg-white ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Number & Icon Side */}
                            <div className={`w-full md:w-1/3 p-10 flex flex-col justify-between relative overflow-hidden ${index % 2 === 0 ? 'bg-primary text-white' : 'bg-white text-primary border-b md:border-b-0 md:border-r border-gray-100'}`}>
                                <div className="relative z-10">
                                    <span className="text-8xl font-bold font-achiko opacity-20 absolute -top-10 -left-6 select-none">
                                        0{stage.id}
                                    </span>
                                    <div className={`inline-flex p-3 rounded-2xl mb-6 ${index % 2 === 0 ? 'bg-white/10 checkbox-backdrop-blur' : 'bg-primary/5'}`}>
                                        <stage.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold font-achiko mb-2 leading-tight">
                                        {stage.title}
                                    </h3>
                                    <p className={`text-lg font-medium opacity-80 uppercase tracking-widest text-xs ${index % 2 === 0 ? 'text-white' : 'text-gray-500'}`}>
                                        {stage.subtitle}
                                    </p>
                                </div>

                                {/* Abstract Shapes */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border-8 border-current opacity-5 z-0"></div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-secondary"></span>
                                            Meaning & Significance
                                        </h4>
                                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                                            {stage.meaning}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex flex-wrap gap-3">
                                            {stage.significance.split(', ').map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 border border-gray-100 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors cursor-default"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Bottom Quote */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 left-0 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
                    <blockquote className="text-xl md:text-2xl font-medium text-gray-800 italic relative z-10">
                        "Transform performance spaces into symbols with meaning."
                    </blockquote>
                    <p className="text-gray-500 mt-4 text-sm font-medium uppercase tracking-widest">Sargolsavam 2025-26</p>
                </div>
            </section>
        </div>
    );
}
