"use client";

import { motion } from "framer-motion";
import { Users, Flame, Trophy, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const teams = [
    {
        id: "sumud",
        name: "Sumud",
        description: "This name represents the unbreakable Palestinian spirit that stood 26 months of relentless bombardment, siege, and displacement, yet refused to surrender or leave the land.",
        icon: Shield,
        gradient: "from-emerald-500 to-teal-700",
        shadow: "shadow-emerald-500/20",
        bg: "bg-emerald-50"
    },
    {
        id: "thoofan",
        name: "Thoofan",
        description: "The historic defensive operation launched by the Palestinian resistance that shattered Israeli invincibility and reignited the flame of liberation across the globe.",
        icon: Flame,
        gradient: "from-red-500 to-orange-700",
        shadow: "shadow-red-500/20",
        bg: "bg-red-50"
    },
    {
        id: "inthisar",
        name: "Inthisar",
        description: "The triumph of people who turned every massacre into greater resolve, every destroyed home into a promise of return, and every martyr into a guarantee that Palestine will be free from the river to the sea.",
        icon: Trophy,
        gradient: "from-amber-400 to-yellow-600",
        shadow: "shadow-amber-500/20",
        bg: "bg-amber-50"
    }
];

export default function TeamsPage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                            Sargolsavam 2025-26
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold font-achiko text-slate-900 tracking-tight">
                            Our <span className="text-primary">Teams</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-slate-600"
                    >
                        Representing resilience, resistance, and triumph.
                    </motion.p>
                </div>

                {/* Teams Grid */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {teams.map((team, index) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                        >
                            <Card className={`h-full border-0 overflow-hidden group hover:scale-105 transition-all duration-500 ${team.shadow} shadow-xl bg-white`}>
                                {/* Header Background */}
                                <div className={`h-32 bg-gradient-to-br ${team.gradient} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                                    {/* Abstract Pattern overlay */}
                                    <div className="absolute inset-0 opacity-20 mix-blend-overlay"
                                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}>
                                    </div>

                                    {/* Icon */}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl rotate-45 flex items-center justify-center shadow-lg z-10 group-hover:rotate-0 transition-transform duration-500">
                                        <team.icon className={`w-10 h-10 ${team.gradient.split(' ')[1].replace('to-', 'text-')} -rotate-45 group-hover:rotate-0 transition-transform duration-500`} />
                                    </div>
                                </div>

                                <CardContent className="pt-14 pb-8 px-6 text-center space-y-4">
                                    <h2 className="text-2xl font-bold text-slate-900 font-achiko tracking-wide">
                                        {team.name}
                                    </h2>
                                    <div className={`w-12 h-1 mx-auto rounded-full bg-gradient-to-r ${team.gradient}`} />
                                    <p className="text-slate-600 leading-relaxed font-light">
                                        {team.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
